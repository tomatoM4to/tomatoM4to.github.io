import time
import tempfile
import matplotlib.pyplot as plt
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

TARGET_URL = "https://tomatom4to.github.io/"
WAIT_TIME = 605  # 10분 5초 대기

def run_real_browser_test():
    # 1. 실제 하드디스크 캐시를 쓰기 위한 임시 폴더 설정
    with tempfile.TemporaryDirectory() as user_data_dir:
        options = Options()
        options.add_argument(f"user-data-dir={user_data_dir}")
        options.add_argument("--disable-gpu")
        # 실제 눈으로 브라우저가 도는 걸 보려면 아래 주석 처리 (현재는 백그라운드 실행)
        # options.add_argument("--headless=new") 
        
        driver = webdriver.Chrome(options=options)
        results = {}

        print("==================================================")
        print(" 1. [최초 접속] 브라우저 캐시에 파일과 ETag 저장 중...")
        print("==================================================")
        driver.get(TARGET_URL)
        
        # 페이지 로드 완료 대기
        while driver.execute_script("return document.readyState") != "complete":
            time.sleep(0.1)
        time.sleep(1)

        # W3C 성능 API로 최초 로딩 시간 측정
        plt_cold = driver.execute_script(
            "const p = window.performance.getEntriesByType('navigation')[0];"
            "return p.loadEventEnd - p.startTime;"
        )
        results['Cold Cache\n(Full Download)'] = plt_cold / 1000  # 초 단위 변환
        print(f"  ⏱️ 최초 로딩 시간 (PLT): {results['Cold Cache\n(Full Download)']:.2f} 초\n")

        print("==================================================")
        print(f" ⏳ {WAIT_TIME//60}분 {WAIT_TIME%60}초 대기 (캐시 만료 시뮬레이션)")
        print("==================================================")
        
        # 터미널 카운트다운 로직
        for remaining in range(WAIT_TIME, 0, -1):
            mins, secs = divmod(remaining, 60)
            timeformat = '{:02d}:{:02d}'.format(mins, secs)
            print(f"\r  대기 중... 남은 시간: {timeformat} ⏳", end="")
            time.sleep(1)
        print("\r  캐시 만료 🚀🚀🚀 \n")

        print("==================================================")
        print(" 2. [재접속] 만료된 캐시로 인한 304 재검증 (1 RTT 발생)")
        print("==================================================")
        # 10분이 지났으므로 F5
        driver.refresh()
        
        while driver.execute_script("return document.readyState") != "complete":
            time.sleep(0.1)
        time.sleep(1)

        # 재접속 로딩 시간 측정
        plt_warm = driver.execute_script(
            "const p = window.performance.getEntriesByType('navigation')[0];"
            "return p.loadEventEnd - p.startTime;"
        )
        results['Warm Cache\n(304 Re-validation)'] = plt_warm / 1000
        print(f"  ⏱️ 재검증 로딩 시간 (1 RTT 포함): {results['Warm Cache\n(304 Re-validation)']:.2f} 초\n")

        # 304가 제대로 발생했는지(데이터 전송량이 1KB 보다 작은지) W3C API로 증명
        transfer_size = driver.execute_script(
            "return window.performance.getEntriesByName(arguments[0])[0]?.transferSize;", 
            TARGET_URL
        )
        
        if transfer_size and transfer_size > 0 and transfer_size < 1000:
            print(f"  🟢 [검증 성공] 다운로드 용량: {transfer_size} bytes")
            print("     -> 파일 본문 없이 헤더만 받아옴")
        else:
            print(f"  ⚠️ 다운로드 용량: {transfer_size} bytes (예상과 다를 수 있음)")

        driver.quit()
        return results

def plot_results(results):
    print("\n📊 차트를 생성합니다...")
    plt.style.use('default') 
    fig, ax = plt.subplots(figsize=(7, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    labels = list(results.keys())
    times = list(results.values())

    bars = ax.bar(labels, times, color=['#1a1a1a', '#e63946'], width=0.4)
    bars[1].set_color('#457b9d') 

    ax.set_title('Browser Page Load Time: The Cost of 1 RTT', fontsize=13, fontweight='bold', pad=20)
    ax.set_ylabel('Load Time (Seconds)', fontsize=11, fontweight='bold')
    
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, yval + (max(times)*0.02), f'{yval:.2f}s',
                ha='center', va='bottom', fontsize=12, fontweight='bold')

    warm_time = times[1]
    ax.annotate('Cost of 1 RTT\n(Re-validation Delay)', 
                xy=(1, warm_time), 
                xytext=(1.4, warm_time + (max(times)*0.2)),
                arrowprops=dict(facecolor='#e63946', shrink=0.05, width=2, headwidth=8),
                fontsize=11, color='#e63946', fontweight='bold', ha='center')

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    try:
        data = run_real_browser_test()
        plot_results(data)
    except KeyboardInterrupt:
        print("\n\n🛑 스크립트가 중단")