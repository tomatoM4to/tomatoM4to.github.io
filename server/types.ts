import type { GrayMatterFile } from 'gray-matter';
import type { InitialData, PostData } from "@shared/common.ts";

export type MarkdownPost = Omit<GrayMatterFile<string>, 'data'> & PostData;

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
