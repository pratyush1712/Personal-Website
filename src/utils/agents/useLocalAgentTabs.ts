"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AgentTab, ChatMessage, MAX_TABS, deriveTitle, loadTabs, newTab, saveTabs } from "./agentStorage";

// Manages the set of local agent chat tabs: hydrate from sessionStorage on mount, persist on
// change, and expose create/close/select/append. The active tab is kept valid by an effect so
// callers never have to repair it after a close.
export function useLocalAgentTabs() {
	const [tabs, setTabs] = useState<AgentTab[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		const loaded = loadTabs();
		if (loaded.length > 0) {
			setTabs(loaded);
			setActiveId(loaded[0].id);
		} else {
			const first = newTab();
			setTabs([first]);
			setActiveId(first.id);
		}
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) saveTabs(tabs);
	}, [tabs, hydrated]);

	// Keep activeId pointing at a tab that still exists (or null when all tabs are closed).
	useEffect(() => {
		if (!hydrated) return;
		if (tabs.length === 0) {
			setActiveId(null);
			return;
		}
		if (!tabs.some(t => t.id === activeId)) setActiveId(tabs[tabs.length - 1].id);
	}, [tabs, activeId, hydrated]);

	const activeTab = useMemo(() => tabs.find(t => t.id === activeId) ?? null, [tabs, activeId]);
	const canCreate = tabs.length < MAX_TABS;

	const createTab = useCallback(() => {
		if (tabs.length >= MAX_TABS) return;
		const tab = newTab();
		setTabs(prev => (prev.length >= MAX_TABS ? prev : [...prev, tab]));
		setActiveId(tab.id);
	}, [tabs.length]);

	const closeTab = useCallback((id: string) => {
		setTabs(prev => prev.filter(t => t.id !== id));
	}, []);

	const selectTab = useCallback((id: string) => setActiveId(id), []);

	const appendMessage = useCallback((id: string, message: ChatMessage) => {
		setTabs(prev =>
			prev.map(t => {
				if (t.id !== id) return t;
				const isFirstUser = t.messages.length === 0 && message.role === "user";
				return {
					...t,
					title: isFirstUser ? deriveTitle(message.content) : t.title,
					messages: [...t.messages, message],
					updatedAt: Date.now()
				};
			})
		);
	}, []);

	const setTabTitle = useCallback((id: string, title: string) => {
		const trimmed = title.trim();
		if (!trimmed) return;
		setTabs(prev => prev.map(t => (t.id === id ? { ...t, title: trimmed } : t)));
	}, []);

	return {
		tabs,
		activeTab,
		activeId,
		hydrated,
		canCreate,
		createTab,
		closeTab,
		selectTab,
		appendMessage,
		setTabTitle
	};
}
