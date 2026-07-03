/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generatePitchDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.pitchMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Pitch & Go-To-Market", {
    ...options,
    hasBlockquote: true,
  });
}
