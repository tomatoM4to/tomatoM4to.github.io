import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from "@src/hooks/useTheme"
import { Theme } from "@src/context/Theme";

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!ref.current || !chart) return;

    const mermaidTheme = theme === Theme.Dark ? 'dark' : 'default';

    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
    });

    // 고유한 ID 생성 (리렌더링 시 충돌 방지)
    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    // SVG 렌더링 및 주입
    mermaid.render(id, chart)
      .then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg;
        }
      })
      .catch((e) => {
        console.error('Mermaid rendering failed:', e);
        if (ref.current) {
          ref.current.innerHTML = `<p style="color: red;">다이어그램 렌더링 오류</p>`;
        }
      });

  }, [chart, theme]);

  return <div ref={ref} className="mermaid-wrapper" />;
};
