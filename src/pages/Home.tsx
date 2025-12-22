import { useEffect, useState } from "react";
import { useHead } from '@src/hooks/useHead';
import { ItemType, Item, ItemList, type ContentList } from "@src/components/Item";
import { Pagination } from "@src/components/Pagination";
import { SITE_NAME, SITE_DOMAIN } from "@src/shared/common";
import { useSearchParams } from "react-router";


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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useHead({
    title: SITE_NAME,
    url: SITE_DOMAIN
  }, []);

  useEffect(() => {
    (async function getData() {
      try {
        const response = await fetch(`/api/recent/${currentPage}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ContentList = await response.json();
        setPostList(result.data);
        setTotalPages(Math.ceil(result.len / 4));
      }
      catch (err) {
        console.log(postList);
        console.error(err);
      }
    })();
  }, [currentPage]);

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
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
};
