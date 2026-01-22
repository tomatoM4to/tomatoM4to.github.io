import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router";
import { type GrayMatterFile } from "gray-matter";
import { updateHead } from "@src/hooks/useHead";
import { makeURL } from "@src/shared/common";


const LazyMarkdown = lazy(() => import("@src/components/LazyMarkdown"));
const LazyGiscus = lazy(() => import("@src/components/LazyGiscus"));

export default function Post({ initialData }: { initialData: GrayMatterFile<string> | null }) {
  const { post } = useParams();
  const { networkMountRef } = useNetworkMount();
  const [content, setContent] = useState<string | null>(() => {
    if (initialData) {
      return initialData.content;
    }
    return null;
  });
  const [date, setDate] = useState<string>(() => {
    if (initialData) {
      return initialData.data?.date || '';
    }
    return '';
  });

  useEffect(() => {
    if (!networkMountRef.current) {
      return;
    }
    async function getData() {
      try {
        const response = await fetch(`/api/posts/${post}/index.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: GrayMatterFile<string> = await response.json();
        setContent(result.content);
        setDate(result.data?.date || '');
        const encodedPost = encodeURIComponent(`${post}`);
        updateHead({
          title: result.data.title,
          url: makeURL(`posts/${encodedPost}`),
          desc: result.data.description,
          keywords: result.data.keywords,
          type: 'article',
          date: result.data.date
        })
      }
      catch (err) {
        console.error(err);
      }
    }
    getData();
  }, [post]);

  return (
    <div className="post-container">
      <div className="post-header">
        <h1 className="post-title">{post}</h1>
        <div className="post-meta">
          <span className="post-date">{date}</span>
        </div>
      </div>
      <div className="post-content markdown">
        <Suspense fallback={<div className="loader"></div>}>
          {content !== null ? <LazyMarkdown content={content} /> : <div className="loader"></div>}
        </Suspense>
      </div>
      <Suspense fallback={<></>}>
        <LazyGiscus />
      </Suspense>
    </div>
  )
}