/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generateArchitectureDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.architectureMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Architecture & Stack", {
    ...options,
    monoBlocks: true,
  });
}
