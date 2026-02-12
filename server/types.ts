import type { InitialData } from "@shared/common.ts";

export type Item = {
  id: string
  title: string,
  description: string,
  date: string,
  image: string,
  keywords: string,
}

export type ContentList = {
  len: number,
  data: Item[]
}

export type Render = ({
  url,
  initialData
}: {
  url: string,
  initialData: InitialData
}) => Promise<{
  body: string;
  head: string;
}>;
