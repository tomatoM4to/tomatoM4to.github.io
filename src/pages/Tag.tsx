import { useHead } from "@src/hooks/useHead";
import { useEffect, useState } from "react";
import { makeURL, SITE_NAME } from "@src/shared/common";
import { type ContentList, ItemList, Item } from "@src/components/Item";
import { Link, useSearchParams } from "react-router";
import { Pagination } from "@src/components/Pagination";


export default function Tag() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [allTags, setAllTags] = useState<Record<string, number> | null>(null);
  const [contentList, setContentList] = useState<ContentList | null>(null);
  const [totalPage, setTotalPage] = useState<number>(1);

  useHead({
    title: `${SITE_NAME} - tags`,
    url: makeURL('tags'),
  }, []);

  useEffect(() => {
    (async function getData() {
      try {
        const response = await fetch('/api/tags/all-tags.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Record<string, number> = await response.json();
        setAllTags(result);
      }
      catch (err) {
        console.error(err);
      }
    })();
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
    <div className="tag-container">
      <h1 className="tag-title">태그</h1>

      <div className="tag-cloud">
        {
          allTags && Object.entries(allTags).map(([tagName, count]) => (
            <Link
              to={`?tag=${tagName}`}
              key={tagName}
              className={`tag-item ${tag === tagName ? 'active' : ''}`}
            >
              {tagName} ({count})
            </Link>
          ))
        }
      </div>

      <div className="tag-results-header">
        {tag && <h2>{tag} 태그가 포함된 글</h2>}
      </div>
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