import { createServer } from "node:http";

const port = Number(process.env.PORT || 3000);
const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
const llmProvider = (process.env.LLM_PROVIDER || "openai").toLowerCase();
const llmApiKey =
  process.env.LLM_API_KEY ||
  process.env.OPENAI_API_KEY ||
  process.env.DEEPSEEK_API_KEY ||
  "";
const llmModel =
  process.env.LLM_MODEL ||
  process.env.OPENAI_MODEL ||
  (llmProvider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini");
const openAiEndpoint = process.env.OPENAI_ENDPOINT || "https://api.openai.com/v1/responses";
const deepSeekEndpoint = process.env.DEEPSEEK_ENDPOINT || "https://api.deepseek.com/chat/completions";

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString("utf-8");
      if (data.length > 1024 * 1024) {
        reject(new Error("payload_too_large"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function sendTelegramMessage(chatId, message) {
  if (!botToken) {
    return;
  }
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
}

async function getAiReply(userText) {
  if (!llmApiKey) {
    return `Recebi: ${userText}`;
  }
  try {
    if (llmProvider === "deepseek") {
      const response = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${llmApiKey}`,
        },
        body: JSON.stringify({
          model: llmModel,
          messages: [
            { role: "system", content: "Responda em português do Brasil de forma curta e útil." },
            { role: "user", content: userText },
          ],
        }),
      });
      if (!response.ok) {
        return `Recebi: ${userText}`;
      }
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        return content.trim();
      }
      return `Recebi: ${userText}`;
    }

    const response = await fetch(openAiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${llmApiKey}`,
      },
      body: JSON.stringify({
        model: llmModel,
        input: `Responda em português do Brasil de forma curta e útil:\n\n${userText}`,
      }),
    });
    if (!response.ok) {
      return `Recebi: ${userText}`;
    }
    const data = await response.json();
    if (typeof data?.output_text === "string" && data.output_text.trim()) {
      return data.output_text.trim();
    }
    return `Recebi: ${userText}`;
  } catch {
    return `Recebi: ${userText}`;
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      return json(res, 200, { ok: true, service: "bot-buscador" });
    }

    if (req.method === "GET" && req.url === "/health") {
      return json(res, 200, { status: "healthy" });
    }

    if (req.method === "POST" && req.url === "/webhook/telegram") {
      if (webhookSecret) {
        const received = req.headers["x-telegram-bot-api-secret-token"];
        if (received !== webhookSecret) {
          return json(res, 401, { ok: false, error: "invalid_secret" });
        }
      }

      const raw = await readBody(req);
      const update = raw ? JSON.parse(raw) : {};
      const message = update?.message;
      const chatId = message?.chat?.id;
      const textMessage = message?.text;

      if (!chatId || !textMessage) {
        return json(res, 200, { ok: true, ignored: true });
      }

      const reply = await getAiReply(textMessage);
      await sendTelegramMessage(chatId, reply);
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: "not_found" });
  } catch {
    return json(res, 500, { ok: false, error: "internal_error" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`bot-buscador online na porta ${port}`);
});
