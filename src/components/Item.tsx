import React from 'react';
import { Link } from 'react-router';

export type Post = {
  id: string,
  title: string,
  excerpt: string,
  date: string,
  tags: string[]
}

export const fakePosts = [
  {
    id: 'database',
    title: 'Database',
    excerpt: '데이터베이스 관련 글들을 모아놓았습니다.',
    date: '2024-01-15',
    tags: ['DB', 'SQL']
  },
  {
    id: 'docker',
    title: 'Docker',
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

export function ItemList({children}: {children: React.ReactNode}) {
  return <div className='item-list'>{children}</div>
}