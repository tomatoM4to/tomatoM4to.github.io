import { Link } from 'react-router';
import { ReactNode } from "react";
import { useHead } from '@src/hooks/useHead';
import { SITE_DOMAIN, SITE_NAME } from '@src/entry-server';

export type Post = {
  id: string,
  title: string,
  excerpt: string,
  date: string,
  tags: string[]
}

export const fakePosts = [
  {
    id: 'database (1)',
    title: 'database (1)',
    excerpt: '데이터베이스 관련 글들을 모아놓았습니다.',
    date: '2024-01-15',
    tags: ['DB', 'SQL']
  },
  {
    id: '도커',
    title: '도커',
    excerpt: 'Docker 컨테이너 기술에 대한 내용입니다.',
    date: '2024-01-14',
    tags: ['Docker', 'Container']
  },
  {
    id: 'network',
    title: 'Network',
    excerpt: '네트워크 개념과 실습 내용을 다룹니다.',
    date: '2024-01-13',
    tags: ['Network', 'TCP/IP']
  },
  {
    id: 'linux',
    title: 'Linux',
    excerpt: '리눅스 시스템 관리와 명령어 사용법입니다.',
    date: '2024-01-12',
    tags: ['Linux', 'System']
  }
];

export function Item({post}: {post: Post}) {
  return (
    <Link
        to={`/posts/${post.id}`}
        className="item"
    >
      <h2 className="item-title">{post.title}</h2>
      <p className="item-excerpt">{post.excerpt}</p>
      <div className="item-meta">
        <span className="item-date">{post.date}</span>
        <div className="item-tags">
          {post.tags.map(tag => (
            <span key={tag} className="item-tag">
              {tag}
            </span>
          ))}
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
  useHead({
    title: SITE_NAME,
    url: SITE_DOMAIN
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
