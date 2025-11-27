import { useEffect } from "react";
import { fakePosts, Item, ItemList } from "@src/components/Item";

function Profile() {
  return (
    <div className="profile-container">
      <img
        className="profile-image"
        src="GOAT.jpg"
        alt="2D 역사상 GOAT"
        loading="lazy"
      />
      <p>
        웹개발을 주로 다루는 개발 블로그 입니다. 그 외 운영체제와 같은 CS 적인 지식도 추가적으로 다룹니다.
      </p>
    </div>
  )
}


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
      <Profile />
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
