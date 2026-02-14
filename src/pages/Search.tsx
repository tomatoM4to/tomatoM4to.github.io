import { useHead } from "@src/hooks/useHead";
import { SITE_NAME, makeURL, POSTS_PER_PAGE } from "@shared/common";
import { useEffect, useMemo, useState } from "react";
import {
  type ItemType,
  type ContentList,
  Item,
  ItemList
} from "@src/components/Item";
import { Input } from "@src/ui/input";
import { Card, CardContent } from "@src/ui/card";
import { Search as SearchIcon, Loader2 } from "lucide-react";


const CONCURRENT_FETCH_COUNT = 2;
const SEARCH_DEBOUNCE_DELAY_MS = 500;


export default function Search() {
  const [searchList, setSearchList] = useState<ItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
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

        // 첫 번째 페이지 fetch로 전체 개수 파악
        const response = await fetch(`/api/recent/1.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ContentList = await response.json();
        const totalPages = Math.ceil(result.len / POSTS_PER_PAGE);
        let allPosts = [...result.data];
        let loadedCount = 1;
        setLoadProgress((loadedCount / totalPages) * 100);

        // 남은 페이지를 CONCURRENT_FETCH_COUNT개씩 병렬로 fetch
        for (let i = 2; i <= totalPages; i += CONCURRENT_FETCH_COUNT) {
          const batch: Promise<Response>[] = [];
          for (let j = i; j < i + CONCURRENT_FETCH_COUNT && j <= totalPages; j++) {
            batch.push(fetch(`/api/recent/${j}.json`));
          }

          const results = await Promise.allSettled(batch);

          for (const res of results) {
            if (res.status === 'fulfilled' && res.value.ok) {
              const data: ContentList = await res.value.json();
              allPosts = [...allPosts, ...data.data];
            }
            loadedCount++;
          }

          setSearchList([...allPosts]);
          setLoadProgress((loadedCount / totalPages) * 100);
        }

        setSearchList(allPosts);
        setIsLoading(false);
      }
      catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const filteredList = useMemo(() => {
    const trimmedQuery = debouncedSearchQuery.trim();
    if (!trimmedQuery) return [];
    const query = trimmedQuery.toLowerCase();
    return searchList.filter((item) => (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    ));
  }, [debouncedSearchQuery, searchList]);

  const isSearching =
    !isLoading &&
    searchQuery.trim() !== "" &&
    searchQuery !== debouncedSearchQuery;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">검색</h1>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="포스트 제목, 요약으로 검색..."
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          className="pl-10 h-11"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>데이터 로딩 중...</span>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-border">
          {searchQuery.trim() === "" ? (
            <SearchResultSupport support="검색어를 입력해주세요." />
          ) : isSearching ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>검색 중...</span>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="p-4">
              <ItemList>
                {filteredList.map((item) => (
                  <Item key={item.id} post={item} />
                ))}
              </ItemList>
            </div>
          ) : (
            <SearchResultSupport support="검색 결과가 없습니다." />
          )}
        </div>
      )}
    </div>
  )
}

function SearchResultSupport({support}: {support: string}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{support}</p>
      </CardContent>
    </Card>
  )
}