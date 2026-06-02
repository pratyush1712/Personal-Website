import { GUARD_SYSTEM_PROMPT, PORTFOLIO_ENTITY_ALIASES } from "./agentPrompts";
import { getDynamicPortfolioEntities, matchesDynamicPortfolioEntity } from "./portfolioKnowledge";

// Upper bound on how many entity names are listed in the guard prompt. The hand-curated aliases are
// always included; dynamic (knowledge-derived) entities fill the rest. Deterministic alias matching
// already short-circuits most known-entity queries before the model is ever called, so this list is
// only a hint for borderline phrasings.
const MAX_PROMPT_ENTITIES = 80;

export const PORTFOLIO_AGENT_REFUSAL =
	"I’m a portfolio assistant for Pratyush Sudhakar, so I can only help with questions about his work, projects, background, portfolio, website, and this chat interface.";

type RejectionReason =
	| "portfolio_relevant"
	| "known_portfolio_entity"
	| "contextual_follow_up"
	| "portfolio_site_help"
	| "simple_harmless_query"
	| "unrelated"
	| "prompt_injection"
	| "ambiguous"
	| "empty_user_message"
	| "message_too_long"
	| "invalid_guard_response"
	| "portfolio_public_content_match"
	| "portfolio_entity_match";

export type PortfolioRelevanceDecision = {
	allowed: boolean;
	isPortfolioRelevant: boolean;
	isKnownPortfolioEntity: boolean;
	isContextualFollowUp: boolean;
	isPortfolioSiteHelp: boolean;
	allowSimpleHarmlessQuery: boolean;
	rejectionReason: RejectionReason;
	confidence: number;
};

type MessageLike = {
	role: string;
	content: string;
};

type OpenAIChatCompletionResponse = {
	choices?: Array<{
		finish_reason?: string | null;
		message?: {
			content?: unknown;
		};
	}>;
};

type GuardModelOutput = {
	allowed: boolean;
	isPortfolioRelevant: boolean;
	isKnownPortfolioEntity: boolean;
	isContextualFollowUp: boolean;
	isPortfolioSiteHelp: boolean;
	allowSimpleHarmlessQuery: boolean;
	rejectionReason:
		| "portfolio_relevant"
		| "known_portfolio_entity"
		| "contextual_follow_up"
		| "portfolio_site_help"
		| "simple_harmless_query"
		| "unrelated"
		| "prompt_injection"
		| "ambiguous"
		| "empty_user_message";
	confidence: number;
};

type RelevanceOptions = {
	apiKey?: string;
	model?: string;
	fetcher?: typeof fetch;
	currentPage?: string;
};

function positiveInt(value: string | undefined, fallback: number): number {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function guardReasoningEffort(value: string | undefined): "none" | "minimal" | "low" | "medium" | "high" {
	return value === "none" || value === "minimal" || value === "low" || value === "medium" || value === "high"
		? value
		: "none";
}

export const PORTFOLIO_AGENT_GUARD_MODEL = process.env.PORTFOLIO_AGENT_GUARD_MODEL ?? "gpt-5.1-mini";
export const PORTFOLIO_AGENT_GUARD_MAX_COMPLETION_TOKENS = positiveInt(
	process.env.PORTFOLIO_AGENT_GUARD_MAX_COMPLETION_TOKENS,
	300
);
export const PORTFOLIO_AGENT_GUARD_REASONING_EFFORT = guardReasoningEffort(
	process.env.PORTFOLIO_AGENT_GUARD_REASONING_EFFORT
);

export const MAX_GUARD_MESSAGE_CHARS = 1_500;
export const MAX_GUARD_TRANSCRIPT_CHARS = 5_000;
const MAX_GUARD_MESSAGE_SLICE_CHARS = 900;
const MAX_SIMPLE_HARMLESS_CHARS = 80;

const SIMPLE_ARITHMETIC_PREFIX_RE = /^(?:what\s+is|what's|calculate|compute|solve)\s+/i;
const SIMPLE_ARITHMETIC_RE = /^[\d\s+\-*/().%^=?:]+$/;
const HAS_DIGIT_RE = /\d/;
const HAS_OPERATOR_RE = /[+\-*/%^]/;

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
	/\bignore\s+(?:all\s+)?(?:previous|prior|above|system|developer)\s+instructions?\b/i,
	/\bdisregard\s+(?:all\s+)?(?:previous|prior|above|system|developer)\s+instructions?\b/i,
	/\boverride\s+(?:the\s+)?(?:system|developer|instructions|prompt)\b/i,
	/\breveal\s+(?:your\s+)?(?:system|developer|hidden|initial)\s+(?:prompt|instructions|message)\b/i,
	/\bshow\s+(?:me\s+)?(?:your\s+)?(?:system|developer|hidden|initial)\s+(?:prompt|instructions|message)\b/i,
	/\bjailbreak\b/i,
	/\bact\s+as\s+(?:a\s+)?(?:general|unrestricted|uncensored)\b/i,
	/\bpretend\s+(?:you\s+are|to\s+be)\s+(?:a\s+)?(?:general|unrestricted|uncensored)\b/i,
	/\byou\s+are\s+now\s+(?:a\s+)?(?:general|unrestricted|uncensored)\b/i
];

const PRATYUSH_REFERENCE_RE = /\b(?:pratyush(?:\s+sudhakar)?|sudhakar|his|him|he)\b/i;
const CURATED_PUBLIC_CONTENT_RE =
	/\b(?:github\s+profile|github\s+projects?|github\s+repos?|linkedin\s+profile|linkedin\s+posts?|linkedin\s+articles?|featured\s+posts?|featured\s+content|writing|articles?|technical\s+writing|public\s+posts?)\b/i;

const DIRECT_PORTFOLIO_PUBLIC_CONTENT_PATTERNS: RegExp[] = [
	/\b(?:where|what|show|tell|list|summarize|describe|link|links?|find|open|view)\b[\s\S]{0,120}\bpratyush(?:\s+sudhakar)?\b[\s\S]{0,120}\b(?:github|linkedin|featured\s+posts?|featured\s+content|writing|articles?|technical\s+writing|public\s+posts?)\b/i,
	/\b(?:where|what|show|tell|list|summarize|describe|link|links?|find|open|view)\b[\s\S]{0,120}\b(?:github|linkedin|featured\s+posts?|featured\s+content|writing|articles?|technical\s+writing|public\s+posts?)\b[\s\S]{0,120}\bpratyush(?:\s+sudhakar)?\b/i,
	/\bwhat\s+(?:has|does|did)\s+pratyush(?:\s+sudhakar)?\b[\s\S]{0,80}\b(?:posted|written|published|featured)\b/i,
	/\bwhat\s+public\s+writing\s+does\s+pratyush(?:\s+sudhakar)?\s+have\b/i,
	/\b(?:where|what|show|tell|list|summarize|describe|link|links?|find|open|view)\b[\s\S]{0,120}\b(?:his|him|he)\b[\s\S]{0,120}\b(?:github\s+profile|github\s+projects?|github\s+repos?|linkedin\s+profile|linkedin\s+posts?|linkedin\s+articles?|featured\s+posts?|featured\s+content|writing|articles?|technical\s+writing|public\s+posts?)\b/i
];

// Narrow website/chat-interface help allow-list. Keep this intentionally small so it does not become general tech support.
const PORTFOLIO_SITE_HELP_PATTERNS: RegExp[] = [
	/\b(?:how|where|what|can|could|do|does|is|are)\b[\s\S]{0,80}\b(?:use|using|navigate|search|find|open|access)\b[\s\S]{0,80}\b(?:this\s+)?(?:site|website|portfolio|page|chat|agent|assistant|interface|sidebar|files?|tabs?)\b/i,
	/\bwhere\b[\s\S]{0,50}\b(?:resume|cv|contact|email|projects?|experience|skills?|writing|articles?)\b/i,
	/\bhow\s+(?:do|can)\s+i\b[\s\S]{0,50}\b(?:find|open|access|download|view)\b[\s\S]{0,50}\b(?:resume|cv|contact|email|projects?|experience|skills?|writing|articles?)\b/i,
	/\b(?:where|how|can|could)\b[\s\S]{0,80}\b(?:find|open|access|view|see|get)\b[\s\S]{0,80}\b(?:pratyush(?:\s+sudhakar)?|his)\b[\s\S]{0,50}\b(?:github|linkedin)\b/i,
	/\b(?:where|how|can|could)\b[\s\S]{0,80}\b(?:github|linkedin)\b[\s\S]{0,80}\b(?:pratyush(?:\s+sudhakar)?|his|profile|link|links?)\b/i,
	/\b(?:can|could|how\s+do|how\s+can)\b[\s\S]{0,80}\b(?:export|download|save|copy|share|clear|delete|reset)\b[\s\S]{0,80}\b(?:(?:this|current|the|portfolio|agent)\s+)?(?:chat|conversation|thread|tab|session)\b/i,
	/\b(?:start|create|open)\b[\s\S]{0,40}\b(?:new\s+)?(?:chat|conversation|thread|tab)\b/i,
	/\b(?:what\s+can\s+i\s+ask|what\s+can\s+you\s+(?:answer|help\s+with|do)|how\s+does\s+(?:this\s+)?(?:agent|assistant|chat)\s+work)\b/i,
	/\b(?:files?\s+on\s+the\s+left|left\s+sidebar|portfolio\s+files?|search\s+portfolio|portfolio\s+search|chat\s+tabs?)\b/i
];

export const GUARD_RESPONSE_FORMAT = {
	type: "json_schema",
	json_schema: {
		name: "portfolio_relevance_decision",
		strict: true,
		schema: {
			type: "object",
			additionalProperties: false,
			properties: {
				allowed: { type: "boolean" },
				isPortfolioRelevant: { type: "boolean" },
				isKnownPortfolioEntity: { type: "boolean" },
				isContextualFollowUp: { type: "boolean" },
				isPortfolioSiteHelp: { type: "boolean" },
				allowSimpleHarmlessQuery: { type: "boolean" },
				rejectionReason: {
					type: "string",
					enum: [
						"portfolio_relevant",
						"known_portfolio_entity",
						"contextual_follow_up",
						"portfolio_site_help",
						"simple_harmless_query",
						"unrelated",
						"prompt_injection",
						"ambiguous",
						"empty_user_message"
					]
				},
				confidence: {
					type: "number",
					minimum: 0,
					maximum: 1
				}
			},
			required: [
				"allowed",
				"isPortfolioRelevant",
				"isKnownPortfolioEntity",
				"isContextualFollowUp",
				"isPortfolioSiteHelp",
				"allowSimpleHarmlessQuery",
				"rejectionReason",
				"confidence"
			]
		}
	}
} as const;

function latestUserMessage(messages: MessageLike[]): string {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role === "user" && typeof message.content === "string") return message.content.trim();
	}

	return "";
}

function matchesAny(input: string, patterns: RegExp[]): boolean {
	return patterns.some(pattern => pattern.test(input));
}

function normalizeForEntityMatch(input: string): string {
	return input
		.toLowerCase()
		.replace(/[’']/g, "")
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function mentionsPortfolioEntity(input: string): boolean {
	const normalizedInput = ` ${normalizeForEntityMatch(input)} `;

	const matchesStaticAlias = PORTFOLIO_ENTITY_ALIASES.some(alias => {
		const normalizedAlias = normalizeForEntityMatch(alias);
		return normalizedAlias.length > 0 && normalizedInput.includes(` ${normalizedAlias} `);
	});

	if (matchesStaticAlias) return true;

	// Dynamic entities are discovered from the portfolio knowledge base (repo/project names like
	// "CleverHug"), so newly-ingested work is recognized without editing the hardcoded alias list.
	return matchesDynamicPortfolioEntity(input);
}

// Curated aliases first (highest priority), then knowledge-derived entities, de-duplicated by their
// normalized form and capped to keep the guard prompt bounded.
function getKnownPortfolioEntitiesForPrompt(): readonly string[] {
	const merged: string[] = [];
	const seen = new Set<string>();

	for (const alias of [...PORTFOLIO_ENTITY_ALIASES, ...getDynamicPortfolioEntities()]) {
		const normalized = normalizeForEntityMatch(alias);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		merged.push(alias);
		if (merged.length >= MAX_PROMPT_ENTITIES) break;
	}

	return merged;
}

export function isSimpleHarmlessQuery(input: string): boolean {
	let text = input.trim();
	if (!text || text.length > MAX_SIMPLE_HARMLESS_CHARS) return false;

	text = text.replace(SIMPLE_ARITHMETIC_PREFIX_RE, "").trim();
	text = text.replace(/[?。！？]+$/g, "").trim();

	return SIMPLE_ARITHMETIC_RE.test(text) && HAS_DIGIT_RE.test(text) && HAS_OPERATOR_RE.test(text);
}

export function isPortfolioSiteHelpQuery(input: string): boolean {
	return matchesAny(input, PORTFOLIO_SITE_HELP_PATTERNS);
}

export function isDirectPortfolioPublicContentQuery(input: string): boolean {
	return (
		matchesAny(input, DIRECT_PORTFOLIO_PUBLIC_CONTENT_PATTERNS) ||
		(PRATYUSH_REFERENCE_RE.test(input) && CURATED_PUBLIC_CONTENT_RE.test(input))
	);
}

function buildGuardUserPrompt(args: {
	latestUserMessage: string;
	recentConversation: string;
	currentPage?: string;
	knownPortfolioEntities: readonly string[];
	preapprovedSimpleHarmlessQuery: boolean;
}) {
	return JSON.stringify(
		{
			task: "Classify whether the latest user message may be answered by Pratyush Sudhakar's Portfolio Agent.",
			currentPage: args.currentPage ?? null,
			latestUserMessage: args.latestUserMessage,
			recentConversation: args.recentConversation,
			knownPortfolioEntities: args.knownPortfolioEntities,
			preapprovedSimpleHarmlessQuery: args.preapprovedSimpleHarmlessQuery,
			outputInstructions: {
				returnOnlyJson: true,
				noMarkdown: true,
				noExplanationOutsideJson: true
			}
		},
		null,
		2
	);
}

function isAllowedGuardDecision(decision: GuardModelOutput): boolean {
	if (decision.allowSimpleHarmlessQuery) return true;

	const hasAllowedReason =
		decision.isPortfolioRelevant ||
		decision.isKnownPortfolioEntity ||
		decision.isContextualFollowUp ||
		decision.isPortfolioSiteHelp;

	const safeReason = [
		"portfolio_relevant",
		"known_portfolio_entity",
		"contextual_follow_up",
		"portfolio_site_help",
		"simple_harmless_query"
	].includes(decision.rejectionReason);

	return decision.allowed === true && hasAllowedReason && safeReason;
}

function safeParseGuardOutput(raw: unknown): GuardModelOutput | null {
	if (typeof raw !== "string") return null;

	try {
		const parsed = JSON.parse(raw) as Partial<GuardModelOutput>;

		if (typeof parsed.allowed !== "boolean") return null;
		if (typeof parsed.isPortfolioRelevant !== "boolean") return null;
		if (typeof parsed.isKnownPortfolioEntity !== "boolean") return null;
		if (typeof parsed.isContextualFollowUp !== "boolean") return null;
		if (typeof parsed.isPortfolioSiteHelp !== "boolean") return null;
		if (typeof parsed.allowSimpleHarmlessQuery !== "boolean") return null;
		if (typeof parsed.rejectionReason !== "string") return null;
		if (typeof parsed.confidence !== "number") return null;
		if (parsed.confidence < 0 || parsed.confidence > 1) return null;

		return parsed as GuardModelOutput;
	} catch {
		return null;
	}
}

function normalizeGuardOutput(output: GuardModelOutput | null): PortfolioRelevanceDecision {
	if (!output) {
		return {
			allowed: false,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "invalid_guard_response",
			confidence: 0
		};
	}

	const allowed = isAllowedGuardDecision(output);

	return {
		allowed,
		isPortfolioRelevant: allowed && output.isPortfolioRelevant,
		isKnownPortfolioEntity: allowed && output.isKnownPortfolioEntity,
		isContextualFollowUp: allowed && output.isContextualFollowUp,
		isPortfolioSiteHelp: allowed && output.isPortfolioSiteHelp,
		allowSimpleHarmlessQuery: allowed && output.allowSimpleHarmlessQuery,
		rejectionReason: allowed ? output.rejectionReason : output.rejectionReason || "ambiguous",
		confidence: output.confidence
	};
}

function parseJsonObject(raw: string): unknown | null {
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		return null;
	}
}

function openAIErrorMessageFromBody(raw: string, fallback: string): string {
	const parsed = parseJsonObject(raw) as { error?: { message?: unknown } } | null;
	const message = parsed?.error?.message;
	return typeof message === "string" && message.trim() ? message.trim() : fallback;
}

export function buildGuardTranscript(messages: MessageLike[]): string {
	const transcript = messages
		.slice(-6)
		.map(message => {
			const role = message.role === "assistant" ? "assistant" : "user";
			const content =
				typeof message.content === "string"
					? message.content.trim().slice(0, MAX_GUARD_MESSAGE_SLICE_CHARS)
					: "";
			return `${role.toUpperCase()}: ${content}`;
		})
		.filter(line => !line.endsWith(": "))
		.join("\n\n");

	return transcript.length > MAX_GUARD_TRANSCRIPT_CHARS
		? `${transcript.slice(0, MAX_GUARD_TRANSCRIPT_CHARS)}\n...(truncated)`
		: transcript;
}

async function classifyWithOpenAI(
	messages: MessageLike[],
	options: Required<Pick<RelevanceOptions, "apiKey" | "model" | "fetcher">> & Pick<RelevanceOptions, "currentPage">
): Promise<GuardModelOutput | null> {
	const latest = latestUserMessage(messages);

	const body = {
		model: options.model,
		reasoning_effort: PORTFOLIO_AGENT_GUARD_REASONING_EFFORT,
		verbosity: "low",
		max_completion_tokens: PORTFOLIO_AGENT_GUARD_MAX_COMPLETION_TOKENS,
		response_format: GUARD_RESPONSE_FORMAT,
		messages: [
			{ role: "system", content: GUARD_SYSTEM_PROMPT },
			{
				role: "user",
				content: buildGuardUserPrompt({
					latestUserMessage: latest,
					recentConversation: buildGuardTranscript(messages),
					currentPage: options.currentPage,
					knownPortfolioEntities: getKnownPortfolioEntitiesForPrompt(),
					preapprovedSimpleHarmlessQuery: isSimpleHarmlessQuery(latest)
				})
			}
		]
	};

	const response = await options.fetcher("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${options.apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});

	// Response bodies are one-use streams. Read once as text, then parse that string.
	// Do not add console.log(await response.json()) above this line, or the body will be consumed.
	const raw = await response.text();

	if (!response.ok) {
		throw new Error(openAIErrorMessageFromBody(raw, "Portfolio Agent relevance check is temporarily unavailable."));
	}

	const data = parseJsonObject(raw) as OpenAIChatCompletionResponse | null;
	const choice = data?.choices?.[0];

	if (!choice || choice.finish_reason === "length") return null;

	return safeParseGuardOutput(choice.message?.content);
}

function fixedDecision(args: PortfolioRelevanceDecision): PortfolioRelevanceDecision {
	return args;
}

export async function getPortfolioRelevanceDecision(
	messages: MessageLike[],
	options: RelevanceOptions = {}
): Promise<PortfolioRelevanceDecision> {
	const latest = latestUserMessage(messages);

	if (!latest) {
		return fixedDecision({
			allowed: false,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "empty_user_message",
			confidence: 0
		});
	}

	if (latest.length > MAX_GUARD_MESSAGE_CHARS) {
		return fixedDecision({
			allowed: false,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "message_too_long",
			confidence: 0
		});
	}

	if (matchesAny(latest, PROMPT_INJECTION_PATTERNS)) {
		return fixedDecision({
			allowed: false,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "prompt_injection",
			confidence: 1
		});
	}

	if (isSimpleHarmlessQuery(latest)) {
		return fixedDecision({
			allowed: true,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: true,
			rejectionReason: "simple_harmless_query",
			confidence: 1
		});
	}

	if (isPortfolioSiteHelpQuery(latest)) {
		return fixedDecision({
			allowed: true,
			isPortfolioRelevant: false,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: true,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "portfolio_site_help",
			confidence: 1
		});
	}

	if (isDirectPortfolioPublicContentQuery(latest)) {
		return fixedDecision({
			allowed: true,
			isPortfolioRelevant: true,
			isKnownPortfolioEntity: false,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "portfolio_public_content_match",
			confidence: 1
		});
	}

	if (mentionsPortfolioEntity(latest)) {
		return fixedDecision({
			allowed: true,
			isPortfolioRelevant: true,
			isKnownPortfolioEntity: true,
			isContextualFollowUp: false,
			isPortfolioSiteHelp: false,
			allowSimpleHarmlessQuery: false,
			rejectionReason: "portfolio_entity_match",
			confidence: 1
		});
	}

	const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("Portfolio Agent is not configured. Add OPENAI_API_KEY on the server.");
	}

	const guardOutput = await classifyWithOpenAI(messages, {
		apiKey,
		model: options.model ?? PORTFOLIO_AGENT_GUARD_MODEL,
		fetcher: options.fetcher ?? fetch,
		currentPage: options.currentPage
	});

	return normalizeGuardOutput(guardOutput);
}
