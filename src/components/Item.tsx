import { Link } from "react-router";
import { ReactNode } from "react";

export type ItemType = {
  id: string,
  title: string,
  description: string,
  date: string,
  image: string,
  keywords: string,
}

export function Item({post}: {post: ItemType}) {
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
