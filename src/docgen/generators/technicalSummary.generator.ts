/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateBaseDocx } from "./_base.generator";
import { ColorThemePalette } from "../themes/palette";

export async function generateTechnicalSummaryDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const markdownText = data?.content?.technicalSummaryMarkdown || "";
  return generateBaseDocx(data, palette, markdownText, "Résumé technique", options);
}
