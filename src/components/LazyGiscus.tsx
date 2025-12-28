import Giscus from "@giscus/react"
import { useTheme } from "@src/hooks/useTheme"
import { Theme } from "@src/context/Theme";

export default function LazyGiscus() {
  const { theme } = useTheme();
  return (
    <Giscus
      id="comments"
      repo="tomatoM4to/tomatoM4to.github.io"
      repoId="R_kgDOP_LjPw"
      category="Announcements"
      categoryId="DIC_kwDOP_LjP84C0Omy"
      mapping="pathname"
      reactionsEnabled="0"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme === Theme.Light ? Theme.Light : Theme.Dark}
      lang="en"
      loading="lazy"
    />
  )
}