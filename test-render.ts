import { renderDocument } from "./src/docgen/src/render";

async function run() {
  const docxData = {
    meta: {
      documentType: "attestation",
      theme: "premium-light",
    },
    formData: {
      developerName: "Test",
      developerStatus: "Test",
      clientName: "Test",
      companyName: "Test",
      projectName: "Test",
      projectType: "Test",
      technologies: "Test",
      keyFeatures: "Test",
      results: "Test",
      duration: "Test",
      description: "Test description"
    },
    content: {
      attestationMarkdown: "Test"
    },
  };

  try {
    const { filename } = await renderDocument(docxData);
    console.log("Success:", filename);
  } catch(e: any) {
    console.error("Error:", e.message, e.details || e);
  }
}

run();
