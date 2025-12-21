import { useHead } from "@src/hooks/useHead";
import { useEffect, useState } from "react";
import { makeURL, SITE_NAME } from "@src/shared/common";
import { type ContentList, ItemList, Item } from "@src/components/Item";


export default function Tag() {
  const [tag, setTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Record<string, number> | null>(null);
  const [contentList, setContentList] = useState<ContentList | null>(null);

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
            <button
              key={tagName}
              className={`tag-item ${tag === tagName ? 'active' : ''}`}
              onClick={() => setTag(tagName)}
            >
              {tagName} ({count})
            </button>
          ))
        }
      </div>

      <div className="tag-results-header">
        {tag && <h2>{tag} 태그가 포함된 글</h2>}
      </div>
      {
        contentList && (
          <ItemList>
            {contentList.data.map(post => (
              <Item post={post} key={post.id} />
            ))}
          </ItemList>
        )
      }
    </div>
  )
}