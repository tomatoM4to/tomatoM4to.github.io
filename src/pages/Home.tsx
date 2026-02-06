import { useEffect, useState } from "react";
import { useHead } from '@src/hooks/useHead';
import { ItemType, Item, ItemList, type ContentList } from "@src/components/Item";
import { Pagination } from "@src/components/Pagination";
import { SITE_NAME, SITE_DOMAIN } from "@src/shared/common";
import { useSearchParams } from "react-router";


function Profile() {
  return (
    <div className="flex items-center gap-6 group">
      <img
        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-background shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl hover:border-primary/20 hover:rotate-3"
        src="reze.webp"
        alt="Chainsaw Man - The Movie: Reze Arc"
        loading="lazy"
      />
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
        setTotalPages(Math.ceil(result.len / 4));
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
