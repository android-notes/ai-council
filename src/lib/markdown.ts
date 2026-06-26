import type { CouncilSession, SessionStage, SharePrivacyOptions } from "../types";
import { redactSensitiveText } from "./redact";

export function sessionToMarkdown(
  session: CouncilSession,
  privacy: SharePrivacyOptions,
  language: "en" | "zh" = hasChinese(session.result?.title ?? session.topic) ? "zh" : "en"
) {
  const result = session.result;
  if (!result) {
    return "";
  }

  const label = labels[language];
  const topic = privacy.hideQuestion ? label.hiddenQuestion : session.topic;
  const context = privacy.hideBackground ? "" : session.context;
  const clean = (value: string) =>
    privacy.redactSensitive ? redactSensitiveText(value) : value;

  const lines = [
    `# ${clean(result.title)}`,
    "",
    `**${label.question}:** ${clean(topic)}`,
  ];

  if (context) {
    lines.push("", `**${label.context}:** ${clean(context)}`);
  }

  lines.push(
    "",
    `## ${label.decisionMemo}`,
    "",
    `### ${label.verdict}`,
    clean(result.verdict),
    "",
    `### ${label.support}`,
    clean(result.strongestSupport),
    "",
    `### ${label.objection}`,
    clean(result.strongestObjection),
    "",
    `### ${label.assumptions}`,
    ...formatList(result.assumptions, clean),
    "",
    `### ${label.risks}`,
    ...formatList(result.risks, clean),
    "",
    `### ${label.actions}`,
    ...formatList(result.actions, clean),
    "",
    `### ${label.minority}`,
    clean(result.minorityOpinion),
    "",
    `### ${label.keyInsight}`,
    clean(result.keyInsight)
  );

  if (session.messages.length > 0) {
    lines.push("", `## ${label.conversationLog}`);

    session.messages.forEach((message, index) => {
      const failed = message.failed ? ` ${label.failed}` : "";
      lines.push(
        "",
        `### ${index + 1}. ${clean(message.roleName)} · ${stageLabels[language][message.stage]}${failed}`,
        clean(message.content.trim() || label.emptyMessage)
      );
    });
  }

  return lines.join("\n");
}

export function renderMarkdownToHtml(markdown: string) {
  const normalized = markdown.replace(/\r\n?/g, "\n").trim();

  if (!normalized) {
    return "";
  }

  const lines = normalized.split("\n");
  const html: string[] = [];
  const paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph.length = 0;
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const closeCodeBlock = () => {
    const languageClass = codeLanguage
      ? ` class="language-${escapeAttribute(sanitizeClassName(codeLanguage))}"`
      : "";
    html.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    inCodeBlock = false;
    codeLanguage = "";
    codeLines = [];
  };

  for (const line of lines) {
    const codeFence = line.match(/^```([A-Za-z0-9_-]+)?\s*$/);

    if (inCodeBlock) {
      if (codeFence) {
        closeCodeBlock();
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (codeFence) {
      closeParagraph();
      closeList();
      inCodeBlock = true;
      codeLanguage = codeFence[1] ?? "";
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInlineMarkdown(heading[2].trim())}</h${level}>`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${renderInlineMarkdown(quote[1].trim())}</blockquote>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    const nextListType = unordered ? "ul" : ordered ? "ol" : null;

    if (nextListType) {
      closeParagraph();
      if (listType && listType !== nextListType) {
        closeList();
      }
      if (!listType) {
        listType = nextListType;
        html.push(`<${listType}>`);
      }
      html.push(`<li>${renderInlineMarkdown((unordered?.[1] ?? ordered?.[1] ?? "").trim())}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  if (inCodeBlock) {
    closeCodeBlock();
  }
  closeParagraph();
  closeList();

  return html.join("");
}

const labels = {
  en: {
    question: "Question",
    hiddenQuestion: "Hidden question",
    context: "Context",
    decisionMemo: "Decision Memo",
    verdict: "Verdict",
    support: "Strongest Support",
    objection: "Strongest Objection",
    assumptions: "Assumptions",
    risks: "Risks",
    actions: "Actions",
    minority: "Minority Opinion",
    keyInsight: "Key Insight",
    conversationLog: "Conversation Log",
    failed: "(failed)",
    emptyMessage: "No content.",
  },
  zh: {
    question: "问题",
    hiddenQuestion: "已隐藏的问题",
    context: "背景",
    decisionMemo: "决策纪要",
    verdict: "结论",
    support: "最强支持理由",
    objection: "最强反对理由",
    assumptions: "关键假设",
    risks: "风险",
    actions: "行动",
    minority: "少数派意见",
    keyInsight: "关键洞察",
    conversationLog: "对话记录",
    failed: "（失败）",
    emptyMessage: "无内容。",
  },
};

const stageLabels: Record<"en" | "zh", Record<SessionStage, string>> = {
  en: {
    opening: "Opening",
    rebuttal: "Rebuttal",
    revision: "Revision",
    crossExam: "Cross-exam",
    riskReview: "Risk review",
    vote: "Vote",
    summary: "Summary",
  },
  zh: {
    opening: "首轮观点",
    rebuttal: "交锋反驳",
    revision: "修正立场",
    crossExam: "交叉追问",
    riskReview: "风险审查",
    vote: "投票",
    summary: "总结",
  },
};

function hasChinese(value: string) {
  return /[\u4e00-\u9fff]/.test(value);
}

function formatList(items: string[], clean: (value: string) => string) {
  return items.length > 0 ? items.map((item) => `- ${clean(item)}`) : ["-"];
}

function renderInlineMarkdown(value: string) {
  let next = escapeHtml(value);
  const placeholders: string[] = [];

  const stash = (html: string) => {
    const token = `\u0000${placeholders.length}\u0000`;
    placeholders.push(html);
    return token;
  };

  next = next.replace(/`([^`]+)`/g, (_match, code: string) =>
    stash(`<code>${code}</code>`)
  );

  next = next.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
    const safeHref = normalizeHref(decodeBasicEntities(href));
    if (!safeHref) {
      return label;
    }
    return stash(
      `<a href="${escapeAttribute(safeHref)}" target="_blank" rel="noreferrer">${label}</a>`
    );
  });

  next = next
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>");

  placeholders.forEach((html, index) => {
    next = next.replaceAll(`\u0000${index}\u0000`, html);
  });

  return next;
}

function normalizeHref(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function decodeBasicEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function sanitizeClassName(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, "");
}
