import { useHead } from "@src/hooks/useHead";
import { useEffect, useState } from "react";
import { makeURL, SITE_NAME, type TagsData } from "@src/shared/common";
import { type ContentList, ItemList, Item } from "@src/components/Item";
import { Link, useSearchParams } from "react-router";
import { Pagination } from "@src/components/Pagination";
import { Badge } from "@src/ui/badge";

type TagProps = {
  initialTags: TagsData;
};

export default function Tag({ initialTags }: TagProps) {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [contentList, setContentList] = useState<ContentList | null>(null);
  const [totalPage, setTotalPage] = useState<number>(1);

  useHead({
    title: `${SITE_NAME} - tags`,
    url: makeURL('tags'),
  }, []);

  useEffect(() => {
    if (!tag) return;
    (async function getData() {
      try {
        const response = await fetch(`/api/tags/${tag}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ContentList = await response.json();
        setContentList(result);
        setTotalPage(Math.ceil(result.len / 4));
      }
      catch (err) {
        console.error(err);
      }
    })();
  }, [tag]);

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">태그</h1>

      <div className="flex flex-wrap gap-2.5 mb-6 pb-6 border-b">
        {
          initialTags && Object.entries(initialTags).map(([tagName, count]) => (
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
              <Link to={`?tag=${tagName}`}>
                {tagName} ({count})
              </Link>
            </Badge>
          ))
        }
      </div>

      {tag && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{tag} 태그가 포함된 글</h2>
        </div>
      )}
      {
        contentList && tag && (
          <>
            <ItemList>
              {
                contentList.data.slice((currentPage - 1) * 4, currentPage * 4).map(post => (
                  <Item post={post} key={post.id} />
                ))
              }
            </ItemList>
            <Pagination currentPage={currentPage} totalPages={totalPage} />
          </>
        )
      }
    </div>
  )
}