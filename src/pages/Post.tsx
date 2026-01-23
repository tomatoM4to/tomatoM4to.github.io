import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router";
import { type GrayMatterFile } from "gray-matter";
import { updateHead } from "@src/hooks/useHead";
import { makeURL } from "@src/shared/common";

const LazyMarkdown = lazy(() => import("@src/components/LazyMarkdown"));
const LazyGiscus = lazy(() => import("@src/components/LazyGiscus"));

type PostMeta = {
  title: string;
  date: string;
  description: string;
  keywords: string;
}

export default function Post({ initialData }: { initialData: GrayMatterFile<string> | null }) {
  const { post } = useParams();
  const { networkMountRef } = useNetworkMount();
  const [content, setContent] = useState<string | null>(() => {
    if (!networkMountRef.current && initialData) {
      return initialData.content;
    }
    return null;
  });
  const [meta, setMeta] = useState<PostMeta>(() => {
    if (!networkMountRef.current && initialData) {
      return {
        title: initialData.data?.title || '',
        date: initialData.data?.date || '',
        description: initialData.data?.description || '',
        keywords: initialData.data?.keywords || '',
      };
    }
    return { title: '', date: '', description: '', keywords: '' };
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
        setMeta({
          title: result.data?.title || '',
          date: result.data?.date || '',
          description: result.data?.description || '',
          keywords: result.data?.keywords || '',
        });
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
        <h1 className="post-title">{meta.title || post}</h1>
        {meta.description && (
          <p className="post-description">{meta.description}</p>
        )}
        <div className="post-meta">
          {meta.date && <span className="post-date">{meta.date}</span>}
          {meta.keywords && (
            <div className="post-tags">
              {meta.keywords.split(',').map((tag) => (
                <div key={tag.trim()} className="post-tag">
                  {tag.trim()}
                </div>
              ))}
            </div>
          )}
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