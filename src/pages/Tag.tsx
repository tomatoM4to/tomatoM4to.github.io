import { useHead } from "@src/hooks/useHead";
import { useEffect, useState } from "react";
import { makeURL, SITE_NAME, POSTS_PER_PAGE, type TagsData } from "@shared/common";
import { type ContentList, ItemList, Item } from "@src/components/Item";
import { Link, useSearchParams } from "react-router";
import { Pagination } from "@src/components/Pagination";
import { Badge } from "@src/ui/badge";
import { Button } from "@src/ui/button";
import { Card, CardContent } from "@src/ui/card";

const LIST_REQUEST_TIMEOUT_MS = 10_000;

type TagProps = {
  initialTags: TagsData;
};

const CS_TAGS = new Set([
  '백준',
  'Database',
  'HTTP',
  'Network',
  'KNU',
  'OS',
  'Big Data',
  '자격증',
  'Paper',
  'OOAD',
  'Assembler'
]);

const LANGUAGE_TAGS = new Set([
  'Python',
  'cpp',
  'JavaScript',
  'SQL',
]);

type TagEntry = [tagName: string, count: number];

const sortTagEntry = ([a]: TagEntry, [b]: TagEntry) => a.localeCompare(b, 'ko');

export default function Tag({ initialTags }: TagProps) {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [contentList, setContentList] = useState<ContentList | null>(null);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<'request' | 'timeout' | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useHead({
    title: `${SITE_NAME} - tags`,
    url: makeURL('tags'),
  }, []);

  useEffect(() => {
    if (!tag) {
      setContentList(null);
      setTotalPage(1);
      setIsLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    setIsLoading(true);
    setContentList(null);
    setError(null);
    const timeout = window.setTimeout(() => {
      setError('timeout');
      setIsLoading(false);
      controller.abort();
    }, LIST_REQUEST_TIMEOUT_MS);
    (async function getData() {
      try {
        const response = await fetch(`/api/tags/${encodeURIComponent(tag)}.json`, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ContentList = await response.json();
        if (signal.aborted) return;
        setContentList(result);
        setTotalPage(Math.ceil(result.len / POSTS_PER_PAGE));
      }
      catch (err) {
        if (signal.aborted) return;
        console.error(err);
        setError('request');
      }
      finally {
        window.clearTimeout(timeout);
        if (!signal.aborted) setIsLoading(false);
      }
    })();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [tag, retryCount]);

  const allTags = Object.entries(initialTags ?? {}) as TagEntry[];
  const languageTags = allTags.filter(([tagName]) => LANGUAGE_TAGS.has(tagName)).sort(sortTagEntry);
  const csTags = allTags.filter(([tagName]) => CS_TAGS.has(tagName)).sort(sortTagEntry);
  const devTags = allTags.filter(([tagName]) => !CS_TAGS.has(tagName) && !LANGUAGE_TAGS.has(tagName)).sort(sortTagEntry);

  const renderTagBadges = (tags: TagEntry[], withBottomBorder = true) => (
    <div
      className={`flex flex-wrap gap-2.5 ${withBottomBorder ? 'mb-6 pb-6 border-b' : 'mb-3 pb-0'}`}
    >
      {
        tags.map(([tagName, count]) => (
          <Badge
            key={tagName}
            variant={tag === tagName ? "default" : "outline"}
            className={`text-sm px-3 py-1 cursor-pointer transition-all duration-200 hover:scale-105 ${
              tag === tagName
                ? "!bg-foreground !text-background hover:!bg-foreground/90"
                : "hover:!bg-foreground hover:!text-background"
            }`}
            asChild
          >
            <Link to={`?${new URLSearchParams({ tag: tagName })}`}>
              {tagName} ({count})
            </Link>
          </Badge>
        ))
      }
    </div>
  );

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <h1 className="text-xl font-semibold tracking-tight mb-2">Language</h1>
      {renderTagBadges(languageTags, false)}

      <h1 className="text-xl font-semibold tracking-tight mb-2">CS</h1>
      {renderTagBadges(csTags, false)}

      <h1 className="text-xl font-semibold tracking-tight mb-2">Dev</h1>
      {renderTagBadges(devTags)}

      {tag && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{tag} 태그가 포함된 글</h2>
        </div>
      )}
      {tag && error && (
        <Card role="alert" className="border-destructive">
          <CardContent className="space-y-4">
            <p className="text-destructive">
              {error === 'timeout'
                ? '글 목록을 불러오는 시간이 초과되었습니다.'
                : '글 목록을 불러오지 못했습니다.'}
            </p>
            <Button variant="outline" onClick={() => setRetryCount(count => count + 1)}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      )}
      {tag && isLoading && (
        <ItemList>
          {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
            <Item key={i} loading />
          ))}
        </ItemList>
      )}
      {!isLoading && contentList && tag && (
        <>
          <ItemList>
            {contentList.data.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE).map(post => (
              <Item post={post} key={post.id} />
            ))}
          </ItemList>
          <Pagination currentPage={currentPage} totalPages={totalPage} />
        </>
      )}
    </div>
  )
}
