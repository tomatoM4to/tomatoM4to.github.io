import { useHead } from "@src/hooks/useHead";
import { SITE_NAME, makeURL, POSTS_PER_PAGE, type Item as ItemType, type ContentList } from "@shared/common";
import { useEffect, useMemo, useState } from "react";
import {
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
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const isLoading = loadStatus === 'loading';

  useHead({
    title: `${SITE_NAME} - search`,
    url: makeURL('search'),
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function fetchPage(page: number): Promise<ContentList> {
      const response = await fetch(`/api/recent/${page}.json`, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }

    (async function getData() {
      try {
        setLoadStatus('loading');
        setSearchList([]);
        setLoadProgress(0);

        const result = await fetchPage(1);
        if (signal.aborted) return;
        const totalPages = Math.max(1, Math.ceil(result.len / POSTS_PER_PAGE));
        const allPosts = [...result.data];
        let loadedCount = 1;
        setLoadProgress((loadedCount / totalPages) * 100);

        for (let i = 2; i <= totalPages; i += CONCURRENT_FETCH_COUNT) {
          const batch: Promise<ContentList>[] = [];
          for (let j = i; j < i + CONCURRENT_FETCH_COUNT && j <= totalPages; j++) {
            batch.push(fetchPage(j));
          }

          const results = await Promise.all(batch);
          if (signal.aborted) return;
          for (const result of results) {
            allPosts.push(...result.data);
          }

          loadedCount += results.length;
          setLoadProgress((loadedCount / totalPages) * 100);
        }

        setSearchList(allPosts);
        setLoadStatus('ready');
      }
      catch (err) {
        if (signal.aborted) return;
        controller.abort();
        console.error(err);
        setLoadStatus('error');
      }
    })();
    return () => controller.abort();
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
    loadStatus === 'ready' &&
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
          disabled={loadStatus !== 'ready'}
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

      {loadStatus === 'error' && (
        <Card role="alert" className="border-destructive">
          <CardContent className="py-6 text-destructive">
            검색 자료를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {loadStatus === 'ready' && (
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
