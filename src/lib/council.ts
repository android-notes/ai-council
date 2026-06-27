import type {
  AppMode,
  CouncilMessage,
  CouncilResult,
  CouncilRole,
  CouncilSession,
  DepthPreset,
  Language,
} from "../types";
import { createId } from "./id";

export function generateRoles(
  mode: AppMode,
  topic: string,
  language: Language,
  modelConnectionId = ""
): CouncilRole[] {
  const isZh = language === "zh";
	  const roleSet =
	    mode === "review"
	      ? [
	          role("host", isZh ? "会议主持" : "Meeting Chair", isZh ? "定义问题、推进流程、归纳分歧" : "Frames the question, moves the discussion forward, and names the trade-offs.", "host"),
	          role("support", isZh ? "支持论证" : "Case Builder", isZh ? "提出支持方案的最强理由和适用条件" : "Builds the strongest case for the proposed direction and its conditions.", "support"),
	          role("skeptic", isZh ? "反证审查" : "Evidence Challenger", isZh ? "寻找关键反例、漏洞和未经验证的假设" : "Challenges assumptions, weak evidence, and missing counterexamples.", "skeptic"),
	          role("risk", isZh ? "风险评估" : "Risk Reviewer", isZh ? "评估成本、约束、失败后果和可逆性" : "Reviews cost, constraints, failure modes, and reversibility.", "risk"),
	          role("creative", isZh ? "沟通摘要" : "Communication Editor", isZh ? "把讨论整理成清晰、可复用且不夸张的摘要" : "Turns the discussion into a clear, reusable, non-sensational summary.", "creative"),
	        ]
      : [
          role("host", isZh ? "主持人" : "Host", isZh ? "定义问题、控制流程、综合结论" : "Defines the question, controls the process, and synthesizes.", "host"),
          role("strategy", isZh ? "战略顾问" : "Strategy Advisor", isZh ? "判断方向是否值得投入" : "Judges whether the direction is worth pursuing.", "support"),
          role("risk", isZh ? "风险官" : "Risk Officer", isZh ? "识别失败代价、不可逆风险和盲区" : "Identifies downside, irreversible risks, and blind spots.", "risk"),
          role("execution", isZh ? "执行顾问" : "Execution Advisor", isZh ? "把建议拆成可执行计划" : "Turns recommendations into concrete next steps.", "executor"),
          role("stakeholder", isZh ? "用户代表" : "Stakeholder Representative", isZh ? "站在真实利益相关者角度反问" : "Represents the real people affected by the decision.", "creative"),
          role("dissent", isZh ? "反方审查员" : "Dissent Reviewer", isZh ? "必须提出少数派意见和反证" : "Must produce dissent, counter-evidence, and minority views.", "skeptic"),
        ];

  return roleSet.map((item) => ({
    ...item,
    prompt: buildRolePrompt(item.name, item.duty, topic, mode, language),
    modelConnectionId,
    participatesInVote: item.tone !== "host" && item.tone !== "creative",
  }));
}

export function createEmptySession(
  mode: AppMode,
  topic: string,
  context: string,
  depth: DepthPreset,
  roles: CouncilRole[]
): CouncilSession {
  const now = new Date().toISOString();
  return {
    id: createId("session"),
    mode,
    topic,
    context,
    depth,
    roles,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createFailedMessage(
  role: CouncilRole,
  stage: CouncilMessage["stage"],
  content: string
): CouncilMessage {
  return {
    id: createId("msg"),
    roleId: role.id,
    roleName: role.name,
    stage,
    content,
    failed: true,
    createdAt: new Date().toISOString(),
  };
}

export function createMessage(
  role: CouncilRole,
  stage: CouncilMessage["stage"],
  content: string
): CouncilMessage {
  return {
    id: createId("msg"),
    roleId: role.id,
    roleName: role.name,
    stage,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function composeResult(
  session: CouncilSession,
  language: Language
): CouncilResult {
  const isZh = language === "zh";
  const score = calculateSupportScore(session);
	  const title = isZh
	    ? session.mode === "review"
	      ? "AI 快速评审纪要"
	      : "AI 决策会议纪要"
	    : session.mode === "review"
	      ? "AI Review Memo"
	      : "AI Council Decision Memo";
  const summary = latestMessage(session, ["host"], "summary") ?? latestMessage(session, ["host"]);
  const support = latestMessage(session, ["support", "strategy"]);
  const objection = latestMessage(session, ["skeptic", "risk"]);
  const risk = latestMessage(session, ["risk", "skeptic"]);
  const action = latestMessage(session, ["executor", "host"], "summary") ?? latestMessage(session, ["executor"]);
  const creative = latestMessage(session, ["creative", "skeptic"]);

  return {
    title,
    supportScore: score,
    verdict: usefulSentence(
      summary?.content,
      isZh
        ? `围绕「${session.topic}」，当前更适合先做小规模验证，而不是直接押上全部资源。`
        : `For "${session.topic}", the safer conclusion is to run a small validation before committing major resources.`
    ),
    strongestSupport: usefulSentence(
      support?.content,
      isZh
        ? "支持方的最强理由是：机会窗口可能真实存在，拖延会让学习速度变慢。"
        : "The strongest supportive argument: the opportunity window may be real, and delay slows learning."
    ),
    strongestObjection: usefulSentence(
      objection?.content,
      isZh
        ? "反方的最强理由是：关键事实不足时，信心很容易被情绪和想象放大。"
        : "The strongest objection: when key facts are missing, confidence can be inflated by emotion and imagination."
    ),
	    keyInsight: usefulSentence(
	      creative?.content ?? objection?.content,
	      isZh
	        ? "先把不可逆的大决定，拆成一次可承受的小验证。"
	        : "Turn the irreversible decision into a validation you can afford to run."
    ),
    assumptions: isZh
      ? ["目标足够重要", "资源有限", "短期内可以做低成本验证"]
      : ["The goal matters", "Resources are limited", "A low-cost validation is possible soon"],
    actions: extractSectionList(
      action?.content,
      ["行动", "Actions"],
      ["风险", "Risks"],
      isZh
        ? ["列出一个 7 天内能完成的最小验证", "写下三个失败信号", "设定继续投入的明确条件"]
        : ["Define one minimum validation that can happen within 7 days", "Write down three failure signals", "Set explicit conditions for further commitment"]
    ),
    risks: extractSectionList(
      summary?.content ?? risk?.content,
      ["风险", "Risks"],
      [],
      isZh
        ? ["把兴趣误判成需求", "低估时间和现金流压力", "被单一模型或单一立场带偏"]
        : ["Mistaking interest for demand", "Underestimating time and cash pressure", "Being biased by one model or one stance"]
    ),
    minorityOpinion: usefulSentence(
      latestMessage(session, ["skeptic"])?.content,
      isZh
        ? "少数派认为，如果机会窗口极短，可以更激进；但前提是先定义可接受损失。"
        : "The minority view: if the opportunity window is very short, a bolder move may be justified, but only with a clear acceptable-loss line."
    ),
  };
}

function role(
  id: string,
  name: string,
  duty: string,
  tone: CouncilRole["tone"]
) {
  return {
    id,
    name,
    duty,
    stance: duty,
    tone,
  };
}

export function buildRolePrompt(
  name: string,
  duty: string,
  topic: string,
  mode: AppMode,
  language: Language
) {
  if (language === "zh") {
	    return `你是「${name}」。你的职责是：${duty}。本场讨论主题是「${topic}」。${
	      mode === "review"
	        ? "你要简洁、直接、可执行；可以指出分歧，但不要夸张或编造事实。"
	        : "你必须克制、结构化，明确假设和风险，不替用户做最终决定。"
	    }`;
  }

	  return `You are "${name}". Your duty: ${duty}. The topic is "${topic}". ${
	    mode === "review"
	      ? "Be concise, direct, and actionable. Name disagreement without exaggerating or inventing facts."
	      : "Be restrained and structured. State assumptions and risks. Do not make the final decision for the user."
	  }`;
}

function latestMessage(
  session: CouncilSession,
  tones: Array<CouncilRole["tone"] | string>,
  stage?: CouncilMessage["stage"]
) {
  const roleToneById = new Map(session.roles.map((role) => [role.id, role.tone]));
  return [...session.messages]
    .reverse()
    .find((message) => {
      if (message.failed) return false;
      if (stage && message.stage !== stage) return false;
      const tone = roleToneById.get(message.roleId);
      return tone ? tones.includes(tone) || tones.includes(message.roleId) : false;
    });
}

function usefulSentence(content: string | undefined, fallback: string) {
  const cleaned = cleanContent(content);
  if (!cleaned) return fallback;

  const candidates = cleaned
    .split(/[\n。！？.!?]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 10);

  return candidates[0] ?? cleaned.slice(0, 180);
}

function extractList(content: string | undefined, fallback: string[]) {
  const cleaned = cleanContent(content, false);
  if (!cleaned) return fallback;

  const bulletLines = cleaned
    .split(/\n+/)
    .filter((line) => /^([-*•]|\d+[.)、])\s*/.test(line.trim()))
    .map((line) => line.replace(/^[-*•\d.)、\s]+/, "").trim())
    .filter((line) => line.length >= 4);

  if (bulletLines.length >= 2) {
    return unique([...bulletLines, ...fallback]).slice(0, 3);
  }

  const clauseLines = cleaned
    .split(/[；;。.!?]+/)
    .map((line) => line.replace(/^.*?(?:建议|next move|next best move|action|行动)[:：]?\s*/i, "").trim())
    .filter((line) => line.length >= 8);

  return unique([...bulletLines, ...clauseLines, ...fallback]).slice(0, 3);
}

function extractSectionList(
  content: string | undefined,
  startMarkers: string[],
  endMarkers: string[],
  fallback: string[]
) {
  const cleaned = cleanContent(content, false);
  if (!cleaned) return fallback;

  const lines = cleaned.split("\n");
  const startIndex = lines.findIndex((line) => hasMarker(line, startMarkers));
  if (startIndex < 0) {
    return extractList(cleaned, fallback);
  }

  const relativeEndIndex = lines
    .slice(startIndex + 1)
    .findIndex((line) => hasMarker(line, endMarkers));
  const endIndex = relativeEndIndex < 0 ? lines.length : startIndex + 1 + relativeEndIndex;
  const section = lines.slice(startIndex + 1, endIndex).join("\n");
  return extractList(section, fallback);
}

function hasMarker(line: string, markers: string[]) {
  const normalized = line.toLowerCase().replace(/[:：]/g, "").trim();
  return markers.some((marker) => normalized === marker.toLowerCase());
}

function cleanContent(content: string | undefined, collapseWhitespace = true) {
  const cleaned = (content ?? "")
    .replace(/^【[^】]+】\s*/g, "")
    .replace(/^\[[^\]]+\]\s*/g, "")
    .replace(/^(主持人总结|Host summary)[:：]\s*/i, "")
    .replace(/^[^：:\n]{1,40}[：:]\s*/, "")
    .trim();

  if (collapseWhitespace) {
    return cleaned.replace(/\s+/g, " ");
  }

  return cleaned
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function unique(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function calculateSupportScore(session: CouncilSession) {
  const base = session.mode === "review" ? 58 : 64;
  const failedCount = session.messages.filter((message) => message.failed).length;
  const score = base - failedCount * 4;
  return Math.max(35, Math.min(82, score));
}
