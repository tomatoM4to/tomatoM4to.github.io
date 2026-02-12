import { useEffect, useState, useRef } from "react";
import { useHead } from '@src/hooks/useHead';
import { ItemType, Item, ItemList, type ContentList } from "@src/components/Item";
import { Pagination } from "@src/components/Pagination";
import { SITE_NAME, SITE_DOMAIN, POSTS_PER_PAGE } from "@shared/common";
import { useSearchParams } from "react-router";
import { Skeleton } from "@src/ui/skeleton";


function Profile() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 이미지가 캐시에서 이미 로드된 경우 처리
    if (imgRef.current?.complete && imgRef.current?.naturalHeight !== 0) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="flex items-center gap-6 group">
      <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 relative">
        {!isLoaded && <Skeleton className="absolute inset-0 rounded-full" />}
        <img
          ref={imgRef}
          className={`w-full h-full rounded-full object-cover border-4 border-background shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl hover:border-primary/20 hover:rotate-3 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          src="reze.webp"
          alt="Chainsaw Man - The Movie: Reze Arc"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <p className="text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
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
        setTotalPages(Math.ceil(result.len / POSTS_PER_PAGE));
      }
      catch (err) {
        console.error(err);
      }
    })();
  }, [currentPage]);

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <Profile />
      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-12">최근 포스트</h2>
      <section className="mt-0">
        <ItemList>
          {postList.map(post => (
            <Item post={post} key={post.id} />
          ))}
        </ItemList>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </div>
  )
};
