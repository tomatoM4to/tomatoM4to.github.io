import { Item, fakePosts, ItemList } from "./Item";
import { useState } from "react";

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

  return (
    <div className="tag-container">
      <h1 className="tag-title">태그</h1>

      <div className="tag-cloud">
        {
          allTags.map((t) => (
            <button key={t.tag} className={`tag-item ${tag === t.tag ? 'active' : ''}`} onClick={() => setTag(t.tag)}>
              {t.tag} ({t.count})
            </button>
          ))
        }
      </div>

      <div className="tag-results-header">
        <h2>{tag} 태그의 포스터 1개</h2>
      </div>
      <ItemList>
        {fakePosts.map(post => (
          <Item post={post} key={post.id} />
        ))}
      </ItemList>
    </div>
  )
}