import { useEffect } from "react";
import { fakePosts, Item, ItemList } from "./Item";

export default function Home({
  setInitialMount
}: {
  setInitialMount: Function
}) {
  useEffect(() => {
    setInitialMount(false);
  }, []);
  return (
    <div className="home-container">
      <h1 className="home-title">최근 포스트</h1>
      <div className="recent-posts-section">
        <ItemList>
          {fakePosts.map(post => (
            <Item post={post} key={post.id} />
          ))}
        </ItemList>
      </div>
    </div>
  )
};
