import { Link } from 'react-router';
import { ReactNode, useEffect, useState } from "react";
import { useHead } from '@src/hooks/useHead';
import { SITE_DOMAIN, SITE_NAME } from '@src/entry-server';

export type Post = {
  id: string,
  title: string,
  description: string,
  date: string,
  image: string,
  keywords: string,
}

export function Item({post}: {post: Post}) {
  return (
    <Link
        to={`/posts/${post.id}`}
        className="item"
    >
      <h2 className="item-title">{post.id}</h2>
      <p className="item-excerpt">{post.description}</p>
      <div className="item-meta">
        <span className="item-date">{post.date}</span>
        <div className="item-tags">
          {post.keywords}
        </div>
      </div>
    </Link>
  )
}

export function ItemList({children}: {children: ReactNode}) {
  return <div className='item-list'>{children}</div>
}

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
  const [postList, setPostList] = useState<Post[]>([]);

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
        const result = await response.json();
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
