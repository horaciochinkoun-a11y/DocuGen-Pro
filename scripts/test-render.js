import { renderDocument } from "./dist/server.js";

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
      description: "Test description"
    },
    content: {
      attestationMarkdown: "Test"
    },
  };

  try {
    const { filename } = await renderDocument(docxData);
    console.log("Success:", filename);
  } catch(e) {
    console.error("Error:", e.message, e.details || "");
  }
}

run();
