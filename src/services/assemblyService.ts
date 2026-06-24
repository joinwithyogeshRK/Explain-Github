import axios from "axios";

const BASE_URL = "https://api.assemblyai.com";

function getHeaders() {
  const key = process.env.ASSEMBLY_API_KEY;
  if (!key) throw new Error("ASSEMBLY_API_KEY is not set");
  return { authorization: key };
}

async function uploadAudio(buffer: Buffer, mimeType: string): Promise<string> {
  const headers = {
    ...getHeaders(),
    "Content-Type": mimeType,
    "Transfer-Encoding": "chunked",
  };

  const { data } = await axios.post<{ upload_url: string }>(
    `${BASE_URL}/v2/upload`,
    buffer,
    { headers },
  );
  return data.upload_url;
}

export async function transcribeAudio(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const headers = getHeaders();
  const audioUrl = await uploadAudio(buffer, mimeType);

  const { data: job } = await axios.post<{ id: string }>(
    `${BASE_URL}/v2/transcript`,
    {
      audio_url: audioUrl,
      language_detection: true,
      speech_models: ["universal-3-pro", "universal-2"],
    },
    { headers },
  );

  const pollUrl = `${BASE_URL}/v2/transcript/${job.id}`;
  while (true) {
    const { data } = await axios.get<{
      status: string;
      text: string;
      error: string;
    }>(pollUrl, { headers });

    if (data.status === "completed") return data.text ?? "";
    if (data.status === "error") {
      throw new Error(`AssemblyAI error: ${data.error}`);
    }

    await new Promise((r) => setTimeout(r, 2500));
  }
}
