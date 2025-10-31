import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";

export default function Post({
  markdown,
  initialMount,
  setInitialMount
}: {
  markdown: string,
  initialMount: boolean,
  setInitialMount: Function
}) {
  const { post } = useParams();
  const [content, setContent] = useState(markdown);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/${post}/index.md`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        setContent(result);
      }
      catch (err) {
        console.error(err);
      }
    }
    if (initialMount) {
      setInitialMount(false);
      console.log(`!!! no network event !!!`);
    }
    else {
      getData();
      console.log(`!!! network event success !!!`)
    }
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