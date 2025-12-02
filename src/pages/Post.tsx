import { useNetworkMount } from "@src/hooks/useMount";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";

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
        const response = await fetch(`/api/${post}/index.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setContent(result.content);
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
      <div className="post-content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}