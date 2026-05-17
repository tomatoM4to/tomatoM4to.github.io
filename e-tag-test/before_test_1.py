import time
import requests
import matplotlib.pyplot as plt

TARGET_URL = "https://tomatom4to.github.io/"

# 논문용 환경 설정: 모바일(4G) 또는 글로벌 접속을 가정한 추가 지연 시간 설정 (초 단위)
# 실제 측정된 50ms에 100ms(0.1초)를 더해 총 150ms 수준의 환경을 시뮬레이션
ADDED_LATENCY = 0.100 

def run_pure_http_test():
    results = {}

    print("==================================================")
    print(f" 🌐 [네트워크 환경] 4G 모바일/글로벌 환경 시뮬레이션 (+{int(ADDED_LATENCY*1000)}ms 적용)")
    print("==================================================")
    
    # 1. 최초 로드
    start_time = time.time()
    response1 = requests.get(TARGET_URL)
    # 실제 걸린 시간에 가상 레이턴시를 더함
    elapsed1 = (time.time() - start_time) + ADDED_LATENCY 
    results['Cold Cache\n(Full Download)'] = elapsed1
    
    etag = response1.headers.get("Etag")
    print(f"  🔵 [200 OK] 새로 다운로드 완료 (시간: {elapsed1:.2f}초)")
    print(f"  🔑 확보된 ETag: {etag}\n")

    time.sleep(1)

    # 2. 304 재검증
    print("==================================================")
    print(" 2. [Test 2] 304 재검증 요청 (1 RTT 비용 측정)")
    print("==================================================")
    headers = {"If-None-Match": etag}
    
    start_time = time.time()
    response2 = requests.get(TARGET_URL, headers=headers)
    elapsed2 = (time.time() - start_time) + ADDED_LATENCY
    results['Warm Cache\n(304 Re-validation)'] = elapsed2

    if response2.status_code == 304:
        print(f"  🟢 [304 Not Modified] 재검증 성공 (시간: {elapsed2:.2f}초)")
    else:
        print(f"  ❌ 응답 코드: {response2.status_code} 실험 실패")
        exit(0)

    print("==================================================")
    return results

def plot_results(results):
    print("📊 차트를 생성합니다...")
    plt.style.use('default') 
    fig, ax = plt.subplots(figsize=(7, 5))
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')

    labels = list(results.keys())
    times = list(results.values())

    bars = ax.bar(labels, times, color=['#1a1a1a', '#e63946'], width=0.4)
    bars[1].set_color('#457b9d') 

    ax.set_title(f'Page Load Time: The Cost of 1 RTT\n(Simulated 4G Mobile / Global Network)', fontsize=13, fontweight='bold', pad=20)
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
    data = run_pure_http_test()
    plot_results(data)