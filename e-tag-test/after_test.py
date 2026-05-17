import time
import tempfile
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# 테스트 대상 (로컬 빌드 결과물을 서빙 중이라고 가정)
TARGET_URL = "http://localhost:4173/" # npm run preview 기본 포트

def run_rtt_verification():
    with tempfile.TemporaryDirectory() as user_data_dir:
        options = Options()
        options.add_argument(f"user-data-dir={user_data_dir}")
        options.add_argument("--disable-gpu")
        # options.add_argument("--headless=new") 
        
        driver = webdriver.Chrome(options=options)
        
        print("\n[Step 1] Cold Visit - Registering Service Worker & Caching Assets")
        driver.get(TARGET_URL)
        time.sleep(3) # SW 등록 및 리소스 다운로드 대기
        
        print("\n[Step 2] Refresh - Measuring Sub-resource RTT (Expected: 0-RTT)")
        driver.refresh()
        time.sleep(2)
        
        # Resource Timing API를 사용하여 하위 리소스들의 duration 측정
        # duration이 0 또는 매우 작으면(예: < 10ms) 캐시에서 즉시 반환된 것임
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
            # 외부 CDN 제외, 로컬 리소스만 체크
            if "localhost" in r['name'] and not r['name'].endswith('sw.js') and not r['name'] == TARGET_URL:
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
            print("No local resources found to verify.")
        print("="*30)

        driver.quit()

if __name__ == "__main__":
    print("🚀 Starting Sub-RTT Verification Test...")
    print("Make sure your project is built and served via 'npm run start:ssg' or similar on port 4173.")
    try:
        run_rtt_verification()
    except Exception as e:
        print(f"Test failed: {e}")
