import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { type GrayMatterFile } from "gray-matter";
import { updateHead } from "@src/hooks/useHead";
import { encodePostId, makeURL } from "@shared/common";
import { Badge } from "@src/ui/badge";
import { Button } from "@src/ui/button";
import { Card, CardContent } from "@src/ui/card";
import { Calendar } from "lucide-react";
import PostSkeleton from "@src/components/PostSkeleton";

const LazyMarkdown = lazy(() => import("@src/components/LazyMarkdown"));
const LazyGiscus = lazy(() => import("@src/components/LazyGiscus"));
const POST_REQUEST_TIMEOUT_MS = 10_000;

type PostMeta = {
  title: string;
  date: string;
  description: string;
  keywords: string;
}

export default function Post({ initialData }: { initialData: GrayMatterFile<string> | null }) {
  const post = decodeURIComponent(useLocation().pathname.slice('/posts/'.length));
  const { networkMountRef } = useNetworkMount();
  const [error, setError] = useState<'request' | 'timeout' | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
    const controller = new AbortController();
    const { signal } = controller;
    setContent(null);
    setError(null);
    const timeout = window.setTimeout(() => {
      setError('timeout');
      controller.abort();
    }, POST_REQUEST_TIMEOUT_MS);
    async function getData() {
      try {
        const encodedPost = encodeURIComponent(`${post}`);
        const response = await fetch(`/api/posts/${encodedPost}/index.json`, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: GrayMatterFile<string> = await response.json();
        if (signal.aborted) return;
        setContent(result.content);
        setMeta({
          title: result.data?.title || '',
          date: result.data?.date || '',
          description: result.data?.description || '',
          keywords: result.data?.keywords || '',
        });
        updateHead({
          title: result.data.title,
          url: makeURL(`posts/${encodePostId(post)}`),
          desc: result.data.description,
          keywords: result.data.keywords,
          type: 'article',
          date: result.data.date
        })
      }
      catch (err) {
        if (signal.aborted) return;
        console.error(err);
        setError('request');
      }
      finally {
        window.clearTimeout(timeout);
      }
    }
    getData();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [post, retryCount]);

  return (
    <div className="w-full max-w-[820px] mx-auto">
      {error ? (
        <Card role="alert" className="border-destructive">
          <CardContent className="space-y-4">
            <p className="text-destructive">
              {error === 'timeout'
                ? '글을 불러오는 시간이 초과되었습니다.'
                : '글을 불러오지 못했습니다.'}
            </p>
            <Button variant="outline" onClick={() => setRetryCount(count => count + 1)}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      ) : content === null || meta.title === '' ? (
        <PostSkeleton />
      ) : (
        <Suspense fallback={<PostSkeleton />}>
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
                    <Badge
                      key={tag.trim()}
                      variant="secondary"
                      className="inline-flex text-sm px-2.5 py-0.5 font-normal rounded-md transition-transform duration-200 hover:scale-105 cursor-default"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </header>
          <article className="markdown">
            <LazyMarkdown content={content} />
          </article>
        </Suspense>
      )}
      <Suspense fallback={<></>}>
        <LazyGiscus />
      </Suspense>
    </div>
  )
  }
