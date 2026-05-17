import time
import tempfile
import json
import shutil
import matplotlib.pyplot as plt
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# 테스트 대상 (로컬 빌드 결과물을 서빙 중이라면 http://localhost:4173/)
# 만약 배포된 사이트를 테스트하려면 URL을 수정하세요.
TARGET_URL = "https://tomatom4to.github.io/" 

def run_rtt_verification():
    parsed_url = urlparse(TARGET_URL)
    target_domain = parsed_url.netloc
    
    # Windows에서 TemporaryDirectory의 파일 잠금 문제를 피하기 위해 직접 관리
    user_data_dir = tempfile.mkdtemp()
    driver = None
    
    timings = {
        "Cold Visit": 0,
        "Refresh (Warm)": 0
    }
    
    try:
        options = Options()
        options.add_argument(f"user-data-dir={user_data_dir}")
        options.add_argument("--disable-gpu")
        # options.add_argument("--headless=new") 
        
        print(f"Targeting: {TARGET_URL} (Domain: {target_domain})")
        driver = webdriver.Chrome(options=options)
        
        print("\n[Step 1] Cold Visit - Registering Service Worker & Caching Assets")
        driver.get(TARGET_URL)
        time.sleep(5) # SW 등록 및 리소스 다운로드 대기
        
        cold_nav = driver.execute_script("return window.performance.getEntriesByType('navigation')[0].duration")
        timings["Cold Visit"] = cold_nav
        print(f"Cold Page Load: {cold_nav:.2f}ms")
        
        print("\n[Step 2] Refresh - Measuring Sub-resource RTT (Expected: 0-RTT)")
        driver.refresh()
        time.sleep(3)
        
        refresh_nav = driver.execute_script("return window.performance.getEntriesByType('navigation')[0].duration")
        timings["Refresh (Warm)"] = refresh_nav
        print(f"Refresh Page Load: {refresh_nav:.2f}ms")
        
        # Resource Timing API를 사용하여 하위 리소스들의 duration 측정
        resources = driver.execute_script("""
            return window.performance.getEntriesByType('resource').map(r => ({
                name: r.name,
                duration: r.duration,
                transferSize: r.transferSize,
                deliveryType: r.deliveryType || 'unknown'
            }));
        """)
        
        print(f"\n{'Resource Name':<60} | {'Duration':<10} | {'Size':<10}")
        print("-" * 85)
        
        zero_rtt_count = 0
        total_count = 0
        
        for r in resources:
            # 외부 CDN 제외, 대상 도메인 리소스만 체크
            if target_domain in r['name'] and not r['name'].endswith('sw.js') and not r['name'] == TARGET_URL:
                total_count += 1
                is_zero_rtt = r['duration'] < 10 # 10ms 미만을 0-RTT로 간주
                if is_zero_rtt:
                    zero_rtt_count += 1
                
                status = "✅ 0-RTT" if is_zero_rtt else "❌ Network"
                short_name = r['name'].replace(TARGET_URL, '/')
                print(f"{short_name:<60} | {r['duration']:>7.2f}ms | {r['transferSize']:>7} bytes {status}")

        print("\n" + "="*30)
        if total_count > 0:
            success_rate = (zero_rtt_count / total_count) * 100
            print(f"Result: {zero_rtt_count}/{total_count} resources achieved 0-RTT ({success_rate:.1f}%)")
        else:
            print("No matching resources found to verify.")
            print(f"Debug: Total entries found: {len(resources)}")
        print("="*30)

        # Matplotlib visualization
        print("\nGenerating performance chart...")
        labels = list(timings.keys())
        values = list(timings.values())

        plt.figure(figsize=(10, 6))
        bars = plt.bar(labels, values, color=['#ff9999', '#66b3ff'])
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                     f'{height:.2f}ms', ha='center', va='bottom', fontsize=12, fontweight='bold')

        plt.title('Page Load Performance: Cold vs Warm (Refresh)', fontsize=14)
        plt.ylabel('Duration (ms)', fontsize=12)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        
        # Save the plot
        output_file = "benchmark_result.png"
        plt.savefig(output_file)
        print(f"Chart saved to {output_file}")
        
        # Optional: Show plot if not in headless environment
        # plt.show()

    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        if driver:
            print("Closing browser...")
            driver.quit()
            time.sleep(2) # 프로세스 종료 대기
        
        try:
            shutil.rmtree(user_data_dir)
            print("Cleanup successful.")
        except Exception as e:
            print(f"Warning: Cleanup failed (likely file lock): {e}")

if __name__ == "__main__":
    print("🚀 Starting Sub-RTT Verification Test...")
    print("Ensure your project is running (e.g., 'npm run start:ssg' on port 4173).")
    run_rtt_verification()
