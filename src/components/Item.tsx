import { Link } from "react-router";
import { ReactNode } from "react";
import { Badge } from "@src/ui/badge";
import { Calendar } from "lucide-react";
import { Skeleton } from "@src/ui/skeleton";

export type ItemType = {
  id: string,
  title: string,
  description: string,
  date: string,
  image: string,
  keywords: string,
}

export type ContentList = {
  len: number,
  data: ItemType[]
}

export function Item({post, loading}: {post?: ItemType, loading?: boolean}) {
  if (loading) {
    return (
      <div className="block">
        <div className="bg-transparent border-b border-border py-7">
          <div className="mb-2">
            <Skeleton className="h-[25px] w-1/2" />
          </div>
          <div className="mb-3">
            <Skeleton className="h-[26px] w-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <Link to={`/posts/${post.id}`} className="block group">
      <div className="bg-transparent border-b border-border py-7 transition-all duration-300 hover:bg-muted/30 hover:px-4 hover:-mx-4 hover:rounded-lg hover:border-transparent">
        <h3 className="text-xl font-medium group-hover:text-primary transition-colors duration-300 leading-tight mb-2">
          {post.id}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed mb-3 group-hover:text-foreground/80 transition-colors duration-300 line-clamp-1">
          {post.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{post.date}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {post.keywords.split(',').map((tag) => (
              <Badge key={tag.trim()} variant="secondary" className="text-sm px-2.5 py-0.5 font-normal rounded-md transition-transform duration-200 group-hover:scale-105">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ItemList({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col [&>*:first-child>div]:pt-0 [&>*:last-child>div]:border-b-0">
      {children}
    </div>
  )
}
