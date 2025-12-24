import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';

// 필요한 언어만 사용 (cjs 경로 유지)
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';

// 빌드 에러 방지를 위한 헬퍼 함수
function register(name: string, language: any) {
  // default export 객체인지 확인 후 등록
  const langDefinition = language.default || language;
  SyntaxHighlighter.registerLanguage(name, langDefinition);
}

register('typescript', ts);
register('javascript', js);
register('bash', bash);
register('json', json);
register('tsx', tsx);
register('python', python);

export default function LazyMarkdown({content}: {content: string}) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props: any) {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={dracula}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </Markdown>
  );
};
