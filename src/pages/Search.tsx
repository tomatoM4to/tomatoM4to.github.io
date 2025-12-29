import { useHead } from "@src/hooks/useHead";
import { SITE_NAME, makeURL } from "@src/shared/common";
import { useEffect, useState } from "react";
import {
  type ItemType,
  type ContentList,
  Item,
  ItemList
} from "@src/components/Item";


export default function Search() {
  const [searchList, setSearchList] = useState<ItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useHead({
    title: `${SITE_NAME} - search`,
    url: makeURL('search'),
  }, []);

  useEffect(() => {
    (async function getData() {
      try {
        setIsLoading(true);
        setLoadProgress(0);

        const response = await fetch(`/api/recent/1.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ContentList = await response.json();
        const count: number = Math.ceil(result.len / 4);
        setSearchList(result.data);
        setLoadProgress(1 / count * 100);

        await new Promise(resolve => setTimeout(resolve, 300));

        for (let i = 2; i <= count; i++) {
          const response = await fetch(`/api/recent/${i}.json`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result: ContentList = await response.json();
          setSearchList((pre) => [...pre, ...result.data]);
          setLoadProgress(i / count * 100);

          await new Promise(resolve => setTimeout(resolve, 200));
        }

        setIsLoading(false);
      }
      catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredList = searchList.filter((item) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="search-container">
      <h1 className="search-title">검색</h1>

      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="포스트 제목, 요약으로 검색..."
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && <Loading loadProgress={loadProgress} />}

      {!isLoading && (
        <div className="search-results-box">
          {searchQuery.trim() === "" ? (
            <SearchResultSupport support="검색어를 입력해주세요." />
          ) : filteredList.length > 0 ? (
            <ItemList>
              {filteredList.map((item) => (
                <Item key={item.id} post={item} />
              ))}
            </ItemList>
          ) : (
            <SearchResultSupport support="검색 결과가 없습니다." />
          )}
        </div>
      )}
    </div>
  )
}


function Loading({loadProgress}: {loadProgress: number}) {
  return (
    <div className="search-loading">
      <progress value={loadProgress} max="100" className="search-progress" />
    </div>
  )
}


function SearchResultSupport({support}: {support: string}) {
  return (
    <div className="search-no-results">
      <div className="search-empty">
        <p>{support}</p>
      </div>
    </div>
  )
}