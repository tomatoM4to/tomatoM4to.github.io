import { useHead } from "@src/hooks/useHead";
import { useEffect, useState } from "react";
import { makeURL, SITE_NAME } from "@src/shared/common";


type Tag = {
  tag: string,
  count: number
}


const allTags: Tag[] = [
  {tag: 'database', count: 1},
  {tag: 'docker', count: 1},
  {tag: 'linux', count: 1},
  {tag: 'system', count: 1},
  {tag: 'network', count: 1},
  {tag: 'OCI/7', count: 1},
  {tag: 'TCP/IP', count: 1},
  {tag: 'python', count: 1},
];


export default function Tag() {
  const [tag, setTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Record<string, number> | null>(null);
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
      {/* <ItemList>
        {fakePosts.map(post => (
          <Item post={post} key={post.id} />
        ))}
      </ItemList> */}
    </div>
  )
}