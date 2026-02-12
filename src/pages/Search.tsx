import { useHead } from "@src/hooks/useHead";
import { SITE_NAME, makeURL } from "@shared/common";
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

        for (let i = 2; i <= count; i++) {
          const response = await fetch(`/api/recent/${i}.json`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result: ContentList = await response.json();
          setSearchList((pre) => [...pre, ...result.data]);
          setLoadProgress(i / count * 100);
        }

        setIsLoading(false);
      }
      catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredList = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return [];
    const query = trimmedQuery.toLowerCase();
    return searchList.filter((item) => (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    ));
  }, [searchQuery, searchList]);

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