import axios from "axios";
import FormData from "form-data";

const LLAMA_PARSE_BASE_URL = "https://api.cloud.llamaindex.ai";
const LLAMA_PARSE_TIER = process.env.LLAMA_PARSE_TIER ?? "agentic";
const LLAMA_PARSE_VERSION = process.env.LLAMA_PARSE_VERSION ?? "latest";
const LLAMA_PARSE_TIMEOUT_MS = Number(process.env.LLAMA_PARSE_TIMEOUT_MS ?? 300000);
const LLAMA_PARSE_POLL_INTERVAL_MS = Number(
  process.env.LLAMA_PARSE_POLL_INTERVAL_MS ?? 2500,
);
const PDF2JSON_MAX_SIZE_BYTES = Number(
  process.env.PDF2JSON_MAX_SIZE_BYTES ?? 5 * 1024 * 1024,
);

export type ExtractionMethod = "pdf2json" | "llamaparse";

interface LlamaParseUploadResponse {
  id?: string;
}

interface LlamaParseJobResponse {
  id?: string;
  status?: string;
  error?: string;
}

interface LlamaParseResultResponse {
  status?: string;
  error?: string;
  text?: string | { pages?: { text?: string }[] };
  markdown?: string | { pages?: { markdown?: string }[] };
}

function isPdf(mimeType: string, fileName: string): boolean {
  return mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
}

function getLlamaCloudApiKey(): string {
  const apiKey = process.env.LLAMA_CLOUD_API_KEY;
  if (!apiKey) {
    console.error("LlamaParse misconfiguration: API key is not set");
    throw new Error(
      "Document parsing is temporarily unavailable. Please try again later.",
    );
  }
  return apiKey;
}

function extractMarkdownOrText(data: LlamaParseResultResponse): string {
  if (typeof data.markdown === "string") return data.markdown.trim();

  const markdownPages = data.markdown?.pages
    ?.map((page) => page.markdown?.trim())
    .filter(Boolean);
  if (markdownPages?.length) return markdownPages.join("\n\n").trim();

  if (typeof data.text === "string") return data.text.trim();

  const textPages = data.text?.pages
    ?.map((page) => page.text?.trim())
    .filter(Boolean);
  if (textPages?.length) return textPages.join("\n\n").trim();

  return "";
}

async function parseWithLlamaParse(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const apiKey = getLlamaCloudApiKey();

  const formData = new FormData();
  formData.append("file", fileBuffer, {
    filename: fileName,
    contentType: mimeType || "application/octet-stream",
  });
  formData.append("purpose", "parse");

  const upload = await axios.post<LlamaParseUploadResponse>(
    `${LLAMA_PARSE_BASE_URL}/api/v1/files/`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      maxBodyLength: Infinity,
      timeout: LLAMA_PARSE_TIMEOUT_MS,
    },
  );

  const fileId = upload.data.id;
  if (!fileId) throw new Error("LlamaParse upload did not return a file id.");

  const job = await axios.post<LlamaParseJobResponse>(
    `${LLAMA_PARSE_BASE_URL}/api/v2/parse`,
    {
      file_id: fileId,
      tier: LLAMA_PARSE_TIER,
      version: LLAMA_PARSE_VERSION,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: LLAMA_PARSE_TIMEOUT_MS,
    },
  );

  const jobId = job.data.id;
  if (!jobId) throw new Error("LlamaParse did not return a parse job id.");

  const startedAt = Date.now();
  while (Date.now() - startedAt < LLAMA_PARSE_TIMEOUT_MS) {
    const result = await axios.get<LlamaParseResultResponse>(
      `${LLAMA_PARSE_BASE_URL}/api/v2/parse/${jobId}?expand=markdown,text`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: LLAMA_PARSE_TIMEOUT_MS,
      },
    );

    const status = result.data.status?.toUpperCase();
    if (status === "COMPLETED" || status === "SUCCESS") {
      const text = extractMarkdownOrText(result.data);
      if (!text || text.length < 20) {
        throw new Error("LlamaParse returned no readable text.");
      }
      return text;
    }

    if (status === "FAILED" || status === "ERROR") {
      throw new Error(result.data.error ?? "LlamaParse failed to parse this file.");
    }

    await new Promise((resolve) =>
      setTimeout(resolve, LLAMA_PARSE_POLL_INTERVAL_MS),
    );
  }

  throw new Error("LlamaParse timed out while parsing this file.");
}

const tryPdf2Json = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    import("pdf2json")
      .then(({ default: PDFParser }) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataReady", (data: any) => {
          const rawText = data.Pages.map((page: any) =>
            page.Texts.map((t: any) =>
              decodeURIComponent(t.R.map((r: any) => r.T).join("")),
            ).join(" "),
          ).join("\n");
          resolve(rawText);
        });

        pdfParser.on("pdfParser_dataError", reject);
        pdfParser.parseBuffer(buffer);
      })
      .catch(reject);
  });
};

export const extractTextFromFile = async (
  fileBuffer: Buffer,
  fileName: string = "upload",
  mimeType: string = "application/octet-stream",
): Promise<{ text: string; method: ExtractionMethod }> => {
  const canUsePdf2Json =
    isPdf(mimeType, fileName) && fileBuffer.length <= PDF2JSON_MAX_SIZE_BYTES;

  if (canUsePdf2Json) {
    try {
      const text = await tryPdf2Json(fileBuffer);
      if (text && text.trim().length >= 50) {
        return { text, method: "pdf2json" };
      }
      console.log("⚠️  pdf2json returned insufficient text — trying LlamaParse...");
    } catch {
      console.log("⚠️  pdf2json failed — trying LlamaParse...");
    }
  } else if (isPdf(mimeType, fileName)) {
    console.log(
      `ℹ️  PDF is ${Math.ceil(fileBuffer.length / 1024 / 1024)}MB; ` +
        "skipping pdf2json to protect server memory and using LlamaParse directly.",
    );
  }

  const text = await parseWithLlamaParse(fileBuffer, fileName, mimeType);
  return { text, method: "llamaparse" };
};
