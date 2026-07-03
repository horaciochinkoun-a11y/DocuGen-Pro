/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generateCvVersionDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.cvMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Version CV", options);
}
