"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  ApiError,
  type ConversationDetail,
  type ConversationListItem,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const POLL_MS = 5000;

export function MessagingInbox({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

  const [list, setList] = useState<ConversationListItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [active, setActive] = useState<ConversationDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);

  const loadList = useCallback(async () => {
    try {
      const res = await api.conversations();
      setList(res.results);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadActive = useCallback(async (id: number, markRead = true) => {
    setLoadingActive(true);
    try {
      const conv = await api.conversation(id);
      setActive(conv);
      if (markRead) {
        await api.markRead(id);
        // Refresh list to clear the unread badge
        loadList();
      }
    } finally {
      setLoadingActive(false);
    }
  }, [loadList]);

  // Initial load + handle ?peer= or ?conv=
  useEffect(() => {
    void loadList();

    const peerStr = params.get("peer");
    const convStr = params.get("conv");

    if (peerStr) {
      const peerId = Number(peerStr);
      if (!Number.isNaN(peerId)) {
        api.startConversation(peerId)
          .then((conv) => {
            setActiveId(conv.id);
            // Replace URL — drop ?peer, add ?conv
            router.replace(`${basePath}?conv=${conv.id}`);
          })
          .catch((err) => {
            const msg = err instanceof ApiError ? err.message : "Gabim.";
            alert(msg);
            router.replace(basePath);
          });
        return;
      }
    }
    if (convStr) {
      const cid = Number(convStr);
      if (!Number.isNaN(cid)) setActiveId(cid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load active conversation when activeId changes
  useEffect(() => {
    if (activeId == null) {
      setActive(null);
      return;
    }
    void loadActive(activeId, true);
  }, [activeId, loadActive]);

  // Polling
  useEffect(() => {
    const t = setInterval(() => {
      void loadList();
      if (activeId != null) {
        // Don't mark-read on every poll — that would flicker the badge for unread peers' incoming messages
        void loadActive(activeId, false);
      }
    }, POLL_MS);
    return () => clearInterval(t);
  }, [activeId, loadActive, loadList]);

  function selectConversation(id: number) {
    setActiveId(id);
    router.replace(`${basePath}?conv=${id}`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 h-[calc(100vh-180px)] min-h-[480px] rounded-lg border border-line bg-surface overflow-hidden">
      {/* List */}
      <aside className="border-r border-line flex flex-col min-h-0 lg:min-h-[480px]">
        <header className="px-4 py-3 border-b border-line">
          <h2 className="font-display text-lg text-ink">Mesazhet</h2>
        </header>
        <div className="flex-1 overflow-y-auto">
          {loadingList && (
            <div className="px-4 py-3 text-sm text-stone">Po ngarkohet…</div>
          )}
          {!loadingList && list.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-stone">
              Ende nuk keni biseda.
            </div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={[
                "w-full text-left px-4 py-3 border-b border-line hover:bg-surface-2 transition relative",
                activeId === c.id ? "bg-surface-2" : "",
              ].join(" ")}
            >
              {activeId === c.id && (
                <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-forest" />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-ink truncate">
                      {c.peer.full_name}
                    </span>
                    {c.unread_count > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-forest text-white text-[10px] font-medium numeric">
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  {c.peer.headline && (
                    <div className="text-[10px] uppercase tracking-wider text-stone mt-0.5 truncate">
                      {c.peer.headline}
                    </div>
                  )}
                </div>
                {c.last_message_at && (
                  <span className="shrink-0 text-[10px] text-stone numeric">
                    {formatStamp(c.last_message_at)}
                  </span>
                )}
              </div>
              {c.last_message && (
                <p
                  className={[
                    "mt-1 text-xs truncate",
                    c.unread_count > 0 ? "text-ink" : "text-stone",
                  ].join(" ")}
                >
                  {c.last_message.sender_id === user?.id ? "Ju: " : ""}
                  {c.last_message.body}
                </p>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Active thread */}
      <section className="flex flex-col min-h-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-sm text-stone">
            Zgjidhni një bisedë për të vazhduar.
          </div>
        ) : (
          <ActiveThread
            conv={active}
            onSent={() => {
              void loadActive(active.id, false);
              void loadList();
            }}
          />
        )}
      </section>
    </div>
  );
}

function ActiveThread({
  conv,
  onSent,
}: {
  conv: ConversationDetail;
  onSent: () => void;
}) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new message arrival
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conv.messages.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setSending(true);
    setError("");
    try {
      await api.sendMessage(conv.id, trimmed);
      setBody("");
      onSent();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gabim.";
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="px-5 py-3 border-b border-line flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href={
              conv.peer.role === "freelancer"
                ? `/profesionist/${conv.peer.id}`
                : "#"
            }
            className="font-medium text-ink hover:underline truncate block"
          >
            {conv.peer.full_name}
          </Link>
          {conv.peer.headline && (
            <div className="text-[10px] uppercase tracking-wider text-stone truncate">
              {conv.peer.headline}
            </div>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {conv.messages.length === 0 && (
          <div className="text-center text-sm text-stone py-8">
            Filloni bisedën duke dërguar mesazhin e parë.
          </div>
        )}
        {conv.messages.map((m, i) => {
          const mine = m.sender_id === user?.id;
          const prev = conv.messages[i - 1];
          const sameSenderAsPrev = prev && prev.sender_id === m.sender_id;
          return (
            <div
              key={m.id}
              className={[
                "flex",
                mine ? "justify-end" : "justify-start",
                sameSenderAsPrev ? "" : "mt-3",
              ].join(" ")}
            >
              <div
                className={[
                  "max-w-[80%] rounded-lg px-3.5 py-2 text-sm",
                  mine
                    ? "bg-forest text-white"
                    : "bg-surface-2 text-ink border border-line",
                ].join(" ")}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.body}</p>
                <div
                  className={[
                    "mt-1 text-[10px] numeric",
                    mine ? "text-white/60" : "text-stone",
                  ].join(" ")}
                >
                  {new Date(m.created_at).toLocaleTimeString("sq-AL", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-line p-3 flex items-end gap-2"
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSubmit(e);
            }
          }}
          rows={1}
          placeholder="Shkruani mesazhin… (Enter për të dërguar, Shift+Enter për rresht të ri)"
          className="flex-1 resize-none rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest min-h-[40px] max-h-32"
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="bg-forest text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-deep disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? "..." : "Dërgo"}
        </button>
      </form>
      {error && (
        <div className="px-3 pb-2 text-xs text-danger">{error}</div>
      )}
    </>
  );
}

function formatStamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("sq-AL", {
      hour: "2-digit", minute: "2-digit",
    });
  }
  return d.toLocaleDateString("sq-AL", {
    day: "2-digit", month: "short",
  });
}
