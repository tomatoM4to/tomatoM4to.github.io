import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router"

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
    <>
      <h1>{post}</h1>
      <Markdown>{content}</Markdown>
    </>
  )
}