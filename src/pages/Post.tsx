import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router";
import { type GrayMatterFile } from "gray-matter";
import { updateHead } from "@src/hooks/useHead";
import { makeURL } from "@src/shared/common";
import '@src/styles/Post.css';
import '@src/styles/Markdown.css';

const LazyMarkdown = lazy(() => import("@src/components/LazyMarkdown"));
const LazyGiscus = lazy(() => import("@src/components/LazyGiscus"));

export default function Post({ markdown }: { markdown: string, }) {
  const { post } = useParams();
  const [content, setContent] = useState(markdown);
  const { networkMountRef } = useNetworkMount();

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
        const encodedPost = encodeURIComponent(`${post}`);
        updateHead({
          title: result.data.title,
          url: makeURL(encodedPost),
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
    console.log(`!!! network event !!!`);
  }, [post]);

  return (
    <div className="post-container">
      <div className="post-header">
        <h1 className="post-title">{post}</h1>
        <div className="post-meta">
          <span className="post-date">2024-01-15</span>
          <span className="post-author">tomatoM4to</span>
          <span className="post-reading-time">5분 읽기</span>
        </div>
      </div>
      <div className="post-content markdown">
        <Suspense fallback={<div className="loader"></div>}>
          {content ? <LazyMarkdown content={content} /> : <div className="loader"></div>}
        </Suspense>
      </div>
      <Suspense fallback={<></>}>
        <LazyGiscus />
      </Suspense>
    </div>
  )
}