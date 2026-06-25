import type { ModelRequest } from "./types";
import type { ModelConnection } from "../types";
import { askMockModel, testMockConnection } from "./mockProvider";
import {
  askOpenAiCompatible,
  fetchOpenAiCompatibleModels,
  testOpenAiCompatibleConnection,
} from "./openAiCompatible";

export async function askModel(request: ModelRequest) {
  if (request.connection.protocol === "mock") {
    return askMockModel(request);
  }

  if (request.connection.protocol === "openai-chat-completions") {
    return askOpenAiCompatible(request);
  }

  throw new Error(`Unsupported protocol: ${request.connection.protocol}`);
}

export async function testModelConnection(connection: ModelConnection) {
  if (connection.protocol === "mock") {
    return testMockConnection();
  }

  if (connection.protocol === "openai-chat-completions") {
    return testOpenAiCompatibleConnection(connection);
  }

  return {
    ok: false,
    status: "failed" as const,
    message: "This protocol is not implemented in v1.",
  };
}

export async function fetchModelList(connection: ModelConnection) {
  if (connection.protocol === "openai-chat-completions") {
    return fetchOpenAiCompatibleModels(connection);
  }

  if (connection.protocol === "mock") {
    return {
      ok: true,
      models: [connection.model],
      message: "Mock model loaded.",
    };
  }

  return {
    ok: false,
    models: [],
    message: "This protocol does not support model discovery in v1.",
  };
}
