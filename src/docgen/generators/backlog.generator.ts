/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generateBacklogDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.backlogMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Backlog & MVP", options);
}
