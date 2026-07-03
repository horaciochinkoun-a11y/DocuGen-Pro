/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generateLinkedinVersionDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.linkedinMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Version LinkedIn", options);
}
