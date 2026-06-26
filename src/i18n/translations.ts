import type { Language } from "../types";

export type TranslationKey =
  | "app.subtitle"
  | "nav.home"
  | "nav.connections"
  | "nav.history"
  | "home.review.title"
  | "home.review.body"
  | "home.council.title"
  | "home.council.body"
  | "home.start"
  | "home.tryPreset"
  | "brief.title"
  | "brief.topic"
  | "brief.context"
  | "brief.depth"
  | "brief.build"
  | "brief.quick"
  | "brief.standard"
  | "brief.deep"
  | "lineup.title"
  | "lineup.subtitle"
  | "lineup.start"
  | "lineup.regenerate"
  | "lineup.model"
  | "lineup.prompt"
  | "lineup.diversity"
  | "lineup.diversityHint"
  | "lineup.addModel"
  | "lineup.autoAssign"
  | "lineup.optimized"
  | "lineup.noExtraModels"
  | "lineup.failurePolicy"
  | "lineup.failurePolicyHint"
  | "lineup.fallbackBalanced"
  | "lineup.fallbackConservative"
  | "lineup.fallbackFast"
  | "session.running"
  | "session.completed"
  | "session.stop"
  | "session.stopping"
  | "session.result"
  | "result.title"
  | "result.downloadImage"
  | "result.downloadFailed"
  | "result.copyMarkdown"
  | "result.exportJson"
  | "result.newRound"
  | "result.actions"
  | "result.risks"
  | "result.minority"
  | "result.shareTitle"
  | "result.briefingSummary"
  | "result.copyShareTitle"
  | "result.copyBriefingSummary"
  | "result.manualCopy"
  | "result.privacy"
  | "result.hideQuestion"
  | "result.hideBackground"
  | "result.redactSensitive"
  | "result.saved"
  | "result.copied"
  | "result.copyFailed"
  | "result.exported"
  | "connections.title"
  | "connections.subtitle"
  | "connections.add"
  | "connections.test"
  | "connections.fetchModels"
  | "connections.save"
  | "connections.delete"
  | "connections.protocol"
  | "connections.name"
  | "connections.baseUrl"
  | "connections.baseUrlHelp"
  | "connections.apiKey"
  | "connections.model"
  | "connections.headers"
  | "connections.headersHelp"
  | "connections.keyRequired"
  | "connections.requiredTitle"
  | "connections.requiredBody"
  | "connections.closeSetup"
  | "connections.emptyTitle"
  | "connections.emptyBody"
  | "connections.unsupported"
  | "connections.headersInvalid"
  | "connections.presets"
  | "connections.openaiPreset"
  | "connections.openaiResponsesPreset"
  | "connections.deepseekPreset"
  | "connections.anthropicPreset"
  | "connections.geminiPreset"
  | "connections.ollamaPreset"
  | "connections.openrouterPreset"
  | "connections.relayPreset"
  | "connections.customJsonPreset"
  | "connections.corsHint"
  | "connections.storeKey"
  | "connections.modelsLoaded"
  | "privacy.localData"
  | "privacy.clearAll"
  | "privacy.clearAllHint"
  | "privacy.cleared"
  | "history.title"
  | "history.empty"
  | "history.clear"
  | "history.delete"
  | "common.back"
  | "common.save"
  | "common.cancel"
  | "common.connected"
  | "common.failed"
  | "common.untested"
  | "common.localOnly"
  | "common.estimatedCalls"
  | "common.cost"
  | "common.language";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "app.subtitle":
      "A local-first AI meeting room for structured thinking and decisions.",
    "nav.home": "New question",
    "nav.connections": "Models",
    "nav.history": "History",
    "home.review.title": "Quick review",
    "home.review.body":
      "For fast evaluation, trade-offs, and an actionable first memo.",
    "home.council.title": "Decision meeting",
    "home.council.body":
      "For deeper decisions that need risk review, dissent, and next steps.",
    "home.start": "Start meeting",
    "home.tryPreset": "Suggested questions",
    "brief.title": "Clarify the brief",
    "brief.topic": "Question or topic",
    "brief.context": "Background and constraints",
    "brief.depth": "Meeting depth",
    "brief.build": "Review meeting plan",
    "brief.quick": "Quick",
    "brief.standard": "Standard",
    "brief.deep": "Deep",
    "lineup.title": "Meeting plan",
    "lineup.subtitle":
      "AI Council prepares the roles and model seats. Review the plan, then start the meeting.",
    "lineup.start": "Start meeting",
    "lineup.regenerate": "Regenerate roles",
    "lineup.model": "Model seat",
    "lineup.prompt": "Advanced prompt",
    "lineup.diversity": "Model diversity",
    "lineup.diversityHint":
      "More distinct model seats can broaden the review. One model is enough to start.",
    "lineup.addModel": "Add model",
    "lineup.autoAssign": "Balance model seats",
    "lineup.optimized": "Model seats optimized.",
    "lineup.noExtraModels": "Add an API key before optimizing the lineup.",
    "lineup.failurePolicy": "Model failure policy",
    "lineup.failurePolicyHint": "Balanced retries once, then records the failed role. Conservative stops later roles. Fast skips failed roles.",
    "lineup.fallbackBalanced": "Balanced",
    "lineup.fallbackConservative": "Conservative",
    "lineup.fallbackFast": "Fast",
    "session.running": "Meeting in progress",
    "session.completed": "Meeting completed",
    "session.stop": "Stop",
    "session.stopping": "Stopping after the current model call.",
    "session.result": "View result",
    "result.title": "Decision output",
    "result.downloadImage": "Download image",
    "result.downloadFailed": "Download failed. Please try again.",
    "result.copyMarkdown": "Copy markdown",
    "result.exportJson": "Export JSON",
    "result.newRound": "Start another meeting",
    "result.actions": "Action plan",
    "result.risks": "Risk watchlist",
    "result.minority": "Minority opinion",
    "result.shareTitle": "Memo title",
    "result.briefingSummary": "Briefing summary",
    "result.copyShareTitle": "Copy memo title",
    "result.copyBriefingSummary": "Copy briefing summary",
    "result.manualCopy": "Copy manually",
    "result.privacy": "Export privacy check",
    "result.hideQuestion": "Hide original question",
    "result.hideBackground": "Hide personal background",
    "result.redactSensitive": "Redact emails, phones, and amounts",
    "result.saved": "Saved locally",
    "result.copied": "Copied.",
    "result.copyFailed": "Copy failed. Please copy the text manually.",
    "result.exported": "Export file created.",
    "connections.title": "Model connections",
    "connections.subtitle":
      "Configure one provider key to start. Add more providers later when you need broader model coverage.",
    "connections.add": "Add connection",
    "connections.test": "Test connection",
    "connections.fetchModels": "Fetch models",
    "connections.save": "Save connection",
    "connections.delete": "Delete",
    "connections.protocol": "Protocol",
    "connections.name": "Name",
    "connections.baseUrl": "Base URL",
    "connections.baseUrlHelp":
      "Use your relay backend URL, not the model provider URL. On Netlify, copy the site Production URL and add your function path, for example https://your-site.netlify.app/.netlify/functions/ai-proxy or the /v1 path your function exposes. On Cloudflare, copy the Worker workers.dev URL or custom domain, for example https://your-worker.your-account.workers.dev/v1.",
    "connections.apiKey": "API key",
    "connections.model": "Model ID",
    "connections.headers": "Custom headers",
    "connections.headersHelp": "Optional JSON object. Secrets are only saved when device storage is enabled.",
    "connections.keyRequired": "Add an API key before starting.",
    "connections.requiredTitle": "API key required",
    "connections.requiredBody": "Configure one provider key to start the meeting. Keys stay in your browser unless you choose to save them locally.",
    "connections.closeSetup": "Close",
    "connections.emptyTitle": "No model key yet",
    "connections.emptyBody": "Add a provider connection with your own API key. Without a key, meetings cannot start.",
    "connections.unsupported": "Available",
    "connections.headersInvalid": "Custom headers must be a valid JSON object.",
    "connections.presets": "Provider presets",
    "connections.openaiPreset": "OpenAI official",
    "connections.openaiResponsesPreset": "OpenAI Responses",
    "connections.deepseekPreset": "DeepSeek official",
    "connections.anthropicPreset": "Anthropic",
    "connections.geminiPreset": "Gemini",
    "connections.ollamaPreset": "Ollama local",
    "connections.openrouterPreset": "OpenRouter / relay",
    "connections.relayPreset": "Custom relay",
    "connections.customJsonPreset": "Custom JSON",
    "connections.corsHint":
      "If the browser blocks CORS, use your own Worker, Function, local proxy, or relay endpoint. Local Ollama may need OLLAMA_ORIGINS.",
    "connections.storeKey": "Save key on this device",
    "connections.modelsLoaded": "Models loaded.",
    "privacy.localData": "Local data",
    "privacy.clearAll": "Clear all local data",
    "privacy.clearAllHint":
      "Removes local history, saved model connections, saved keys, and language preference from this browser.",
    "privacy.cleared": "All local data was cleared.",
    "history.title": "Local history",
    "history.empty": "No saved sessions yet.",
    "history.clear": "Clear all local history",
    "history.delete": "Delete",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.connected": "Connected",
    "common.failed": "Failed",
    "common.untested": "Untested",
    "common.localOnly": "Stored only in this browser.",
    "common.estimatedCalls": "Estimated calls",
    "common.cost": "Cost",
    "common.language": "Language",
  },
  zh: {
    "app.subtitle": "一个本地优先的 AI 会议室，用于结构化思考和决策。",
    "nav.home": "新问题",
    "nav.connections": "模型",
    "nav.history": "历史",
    "home.review.title": "快速评审",
    "home.review.body":
      "适合快速判断方向、权衡利弊，并生成第一版行动纪要。",
    "home.council.title": "决策会议",
    "home.council.body":
      "适合需要风险审查、反方意见和明确下一步的重要决策。",
    "home.start": "开始会议",
    "home.tryPreset": "参考问题",
    "brief.title": "确认问题背景",
    "brief.topic": "问题或话题",
    "brief.context": "背景和限制条件",
    "brief.depth": "会议深度",
    "brief.build": "查看会议计划",
    "brief.quick": "快速",
    "brief.standard": "标准",
    "brief.deep": "深度",
    "lineup.title": "会议计划",
    "lineup.subtitle":
      "AI Council 会根据问题准备角色和模型席位。确认无误后即可开始会议。",
    "lineup.start": "开始会议",
    "lineup.regenerate": "换一批角色",
    "lineup.model": "模型席位",
    "lineup.prompt": "高级提示词",
    "lineup.diversity": "模型多样性",
    "lineup.diversityHint":
      "更多不同模型席位可以扩大视角。一个模型也可以先开始。",
    "lineup.addModel": "添加模型",
    "lineup.autoAssign": "平衡模型席位",
    "lineup.optimized": "模型席位已优化。",
    "lineup.noExtraModels": "先配置 API Key，再优化阵容。",
    "lineup.failurePolicy": "模型失败策略",
    "lineup.failurePolicyHint": "平衡模式会先重试一次，再记录失败角色；保守模式停止后续角色；快速模式跳过失败角色。",
    "lineup.fallbackBalanced": "平衡",
    "lineup.fallbackConservative": "保守",
    "lineup.fallbackFast": "快速",
    "session.running": "会议进行中",
    "session.completed": "会议已完成",
    "session.stop": "停止",
    "session.stopping": "会在当前模型调用结束后停止。",
    "session.result": "查看结果",
    "result.title": "决策输出",
    "result.downloadImage": "下载图片",
    "result.downloadFailed": "下载失败，请再试一次。",
    "result.copyMarkdown": "复制 Markdown",
    "result.exportJson": "导出 JSON",
    "result.newRound": "开始新会议",
    "result.actions": "行动计划",
    "result.risks": "风险清单",
    "result.minority": "少数派意见",
    "result.shareTitle": "纪要标题",
    "result.briefingSummary": "简报摘要",
    "result.copyShareTitle": "复制纪要标题",
    "result.copyBriefingSummary": "复制简报摘要",
    "result.manualCopy": "手动复制内容",
    "result.privacy": "导出前隐私检查",
    "result.hideQuestion": "隐藏原始问题",
    "result.hideBackground": "隐藏个人背景",
    "result.redactSensitive": "移除邮箱、电话和金额",
    "result.saved": "已保存到本地",
    "result.copied": "已复制。",
    "result.copyFailed": "复制失败，请手动复制文本。",
    "result.exported": "导出文件已生成。",
    "connections.title": "模型连接",
    "connections.subtitle":
      "配置一个供应商 Key 即可开始。需要更广的模型覆盖时，再逐步添加更多供应商。",
    "connections.add": "添加连接",
    "connections.test": "测试连接",
    "connections.fetchModels": "获取模型",
    "connections.save": "保存连接",
    "connections.delete": "删除",
    "connections.protocol": "连接协议",
    "connections.name": "名称",
    "connections.baseUrl": "Base URL",
    "connections.baseUrlHelp":
      "这里填你自己的代理后端地址，不是模型厂商官网。Netlify 在站点的 Production URL 后加函数路径，例如 https://your-site.netlify.app/.netlify/functions/ai-proxy，或你的函数暴露的 /v1 地址。Cloudflare 在 Worker 页面复制 workers.dev 地址或自定义域名，例如 https://your-worker.your-account.workers.dev/v1。",
    "connections.apiKey": "API Key",
    "connections.model": "模型 ID",
    "connections.headers": "自定义 Headers",
    "connections.headersHelp": "可选 JSON 对象。只有开启本设备保存时，密钥类字段才会持久保存。",
    "connections.keyRequired": "请先配置 API Key，再开始使用。",
    "connections.requiredTitle": "需要配置 API Key",
    "connections.requiredBody": "请配置一个供应商 Key 以开始会议。Key 只保存在当前浏览器，除非你选择本地保存。",
    "connections.closeSetup": "关闭",
    "connections.emptyTitle": "还没有模型 Key",
    "connections.emptyBody": "添加一个带自己 API Key 的供应商连接。没有 Key 时，会议不能开始。",
    "connections.unsupported": "已支持",
    "connections.headersInvalid": "自定义 Headers 必须是合法 JSON 对象。",
    "connections.presets": "供应商预设",
    "connections.openaiPreset": "OpenAI 官方",
    "connections.openaiResponsesPreset": "OpenAI Responses",
    "connections.deepseekPreset": "DeepSeek 官方",
    "connections.anthropicPreset": "Anthropic",
    "connections.geminiPreset": "Gemini",
    "connections.ollamaPreset": "Ollama 本地",
    "connections.openrouterPreset": "OpenRouter / 中转",
    "connections.relayPreset": "自定义中转",
    "connections.customJsonPreset": "自定义 JSON",
    "connections.corsHint":
      "如果浏览器被 CORS 拦截，请使用自己的 Worker、Function、本地代理或中转端点。本地 Ollama 可能需要配置 OLLAMA_ORIGINS。",
    "connections.storeKey": "在本设备保存 Key",
    "connections.modelsLoaded": "模型列表已获取。",
    "privacy.localData": "本地数据",
    "privacy.clearAll": "清空所有本地数据",
    "privacy.clearAllHint":
      "会从当前浏览器移除本地历史、已保存模型连接、已保存 Key 和语言偏好。",
    "privacy.cleared": "所有本地数据已清空。",
    "history.title": "本地历史",
    "history.empty": "还没有保存的会议。",
    "history.clear": "清空本地历史",
    "history.delete": "删除",
    "common.back": "返回",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.connected": "已连接",
    "common.failed": "失败",
    "common.untested": "未测试",
    "common.localOnly": "仅保存在当前浏览器。",
    "common.estimatedCalls": "预计调用",
    "common.cost": "成本",
    "common.language": "语言",
  },
};
