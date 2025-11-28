import { useEffect } from "react"

export default function Search({
  setMount
}: {
  setMount: () => void
}) {
  useEffect(() => {
    setMount();
  }, []);
  return (
    <div className="search-container">
      <h1 className="search-title">검색</h1>
      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="포스트 제목, 내용, 태그로 검색..."
          autoFocus
        />
      </div>

      <div className="search-no-results">
        <div className="search-empty">
          <p>검색어를 입력해주세요.</p>
        </div>
      </div>
    </div>
  )
}