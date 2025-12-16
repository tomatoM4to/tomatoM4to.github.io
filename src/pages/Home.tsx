
import { useEffect, useState } from "react";
import { useHead } from '@src/hooks/useHead';
import { SITE_DOMAIN, SITE_NAME } from '@src/entry-server';
import { ItemType, Item, ItemList } from "@src/components/Item";


function Profile() {
  return (
    <div className="profile-container">
      <img
        className="profile-image"
        src="GOAT.jpg"
        alt="역사상 최고 미녀"
        loading="lazy"
      />
      <p>
        웹개발을 주로 다루는 개발 블로그 입니다. 그 외 운영체제와 같은 CS 적인 지식도 다룹니다.
      </p>
    </div>
  )
}

export default function Home() {
  const [postList, setPostList] = useState<ItemType[]>([]);

  useHead({
    title: SITE_NAME,
    url: SITE_DOMAIN
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(`/api/recent/${1}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ItemType[] = await response.json();
        setPostList(result);
      }
      catch (err) {
        console.error(err);
      }
    }
    getData();
  }, []);

  return (
    <div className="home-container">
      <Profile />
      <h1 className="home-title">최근 포스트</h1>
      <div className="recent-posts-section">
        <ItemList>
          {postList.map(post => (
            <Item post={post} key={post.id} />
          ))}
        </ItemList>
      </div>
    </div>
  )
};
