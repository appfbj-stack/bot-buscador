import { createServer } from "node:http";

const port = Number(process.env.PORT || 3000);
const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

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
  if (!openAiApiKey) {
    return `Recebi: ${userText}`;
  }
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: openAiModel,
        input: `Responda em português do Brasil de forma curta e útil:\n\n${userText}`,
      }),
    });
    if (!response.ok) {
      return `Recebi: ${userText}`;
    }
    const data = await response.json();
    if (typeof data.output_text === "string" && data.output_text.trim()) {
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
