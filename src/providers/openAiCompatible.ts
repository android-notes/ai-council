import type {
  ConnectionTestResult,
  ModelListResult,
  ModelRequest,
  ModelResponse,
} from "./types";
import type { ModelConnection } from "../types";
import {
  buildBearerHeaders,
  buildSystemPrompt,
  buildUserPrompt,
  extractErrorMessage,
  extractModelIds,
  networkErrorMessage,
  safeJson,
  trimBaseUrl,
} from "./shared";

export async function askOpenAiCompatible(
  request: ModelRequest
): Promise<ModelResponse> {
  const endpoint = buildChatCompletionsEndpoint(request.connection.baseUrl);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildBearerHeaders(request.connection),
    body: JSON.stringify({
      model: request.connection.model,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(request),
        },
        {
          role: "user",
          content: buildUserPrompt(request),
        },
      ],
      temperature: request.mode === "review" ? 0.85 : 0.45,
      max_tokens: request.maxOutputTokens,
      stream: false,
    }),
  });

  const json = await safeJson(response);
  if (!response.ok) {
    throw new Error(extractErrorMessage(json, response.status));
  }

  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Protocol mismatch: missing choices[0].message.content.");
  }

  return { content, raw: json };
}

export async function testOpenAiCompatibleConnection(
  connection: ModelConnection
): Promise<ConnectionTestResult> {
  const startedAt = performance.now();

  try {
    const endpoint = buildChatCompletionsEndpoint(connection.baseUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildBearerHeaders(connection),
      body: JSON.stringify({
        model: connection.model,
        messages: [
          {
            role: "user",
            content: "Reply with exactly: ok",
          },
        ],
        max_tokens: 8,
        temperature: 0,
        stream: false,
      }),
    });

    const json = await safeJson(response);
    if (!response.ok) {
      return {
        ok: false,
        status: "failed",
        message: extractErrorMessage(json, response.status),
        latencyMs: Math.round(performance.now() - startedAt),
      };
    }

    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return {
        ok: false,
        status: "failed",
        message: "Protocol mismatch: response did not match Chat Completions.",
        latencyMs: Math.round(performance.now() - startedAt),
      };
    }

    const streamingSupported = await probeStreaming(connection);

    return {
      ok: true,
      status: "connected",
      message: streamingSupported
        ? "Connection test succeeded. Streaming is supported."
        : "Connection test succeeded. Streaming was not detected, so normal responses will be used.",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    return {
      ok: false,
      status: "failed",
      message:
        error instanceof TypeError
          ? networkErrorMessage()
          : error instanceof Error
            ? error.message
            : "Unknown connection error.",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  }
}

export async function fetchOpenAiCompatibleModels(
  connection: ModelConnection
): Promise<ModelListResult> {
  try {
    const response = await fetch(buildModelsEndpoint(connection.baseUrl), {
      method: "GET",
      headers: buildBearerHeaders(connection),
    });
    const json = await safeJson(response);

    if (!response.ok) {
      return {
        ok: false,
        models: [],
        message: extractErrorMessage(json, response.status),
      };
    }

    const models = extractModelIds(json);
    return {
      ok: models.length > 0,
      models,
      message:
        models.length > 0
          ? `${models.length} models loaded.`
          : "No models were returned by this endpoint.",
    };
  } catch (error) {
    return {
      ok: false,
      models: [],
      message:
        error instanceof TypeError
          ? networkErrorMessage("models request")
          : error instanceof Error
            ? error.message
            : "Unknown models request error.",
    };
  }
}

async function probeStreaming(connection: ModelConnection) {
  try {
    const endpoint = buildChatCompletionsEndpoint(connection.baseUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildBearerHeaders(connection),
      body: JSON.stringify({
        model: connection.model,
        messages: [
          {
            role: "user",
            content: "Reply with exactly: ok",
          },
        ],
        max_tokens: 8,
        temperature: 0,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      return false;
    }

    const reader = response.body.getReader();
    const chunk = await reader.read();
    await reader.cancel();
    return Boolean(chunk.value);
  } catch {
    return false;
  }
}

function buildChatCompletionsEndpoint(baseUrl: string) {
  const trimmed = trimBaseUrl(baseUrl);
  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }

  return `${trimmed}/chat/completions`;
}

function buildModelsEndpoint(baseUrl: string) {
  const trimmed = trimBaseUrl(baseUrl);
  if (trimmed.endsWith("/models")) {
    return trimmed;
  }

  if (trimmed.endsWith("/chat/completions")) {
    return trimmed.replace(/\/chat\/completions$/, "/models");
  }

  return `${trimmed}/models`;
}
