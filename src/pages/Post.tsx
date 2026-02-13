import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router";
import { type GrayMatterFile } from "gray-matter";
import { updateHead } from "@src/hooks/useHead";
import { makeURL } from "@shared/common";
import { Badge } from "@src/ui/badge";
import { Calendar } from "lucide-react";

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
    <div className="w-full max-w-[820px] mx-auto">
      <header className="mb-8 pb-6 border-b">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          {meta.title || post}
        </h1>
        {meta.description && (
          <p className="text-muted-foreground text-base md:text-lg mb-4">
            {meta.description}
          </p>
        )}
        <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
          {meta.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{meta.date}</span>
            </div>
          )}
          {meta.keywords && (
            <div className="flex gap-2 flex-wrap">
              {meta.keywords.split(',').map((tag) => (
                <Badge key={tag.trim()} variant="secondary" className="inline-flex text-sm px-2.5 py-0.5 font-normal rounded-md transition-transform duration-200 hover:scale-105 cursor-default">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>
      <article className="markdown">
        <Suspense fallback={<div className="loader"></div>}>
          {content !== null ? <LazyMarkdown content={content} /> : <div className="loader"></div>}
        </Suspense>
      </article>
      <Suspense fallback={<></>}>
        <LazyGiscus />
      </Suspense>
    </div>
  )
}