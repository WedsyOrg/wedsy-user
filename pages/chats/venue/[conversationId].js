import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { VscSend } from "react-icons/vsc";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { formatMessageTime } from "@/utils/chat";

// SSR note: this page uses getServerSideProps only to pass the conversationId
// from the URL through to the client. We deliberately do NOT fetch messages
// server-side because the conversations API requires the couple's auth token
// from localStorage, which is unavailable on the server. Messages are fetched
// on mount client-side, then polled every 5s. This keeps SSR simple and avoids
// leaking tokens via cookies/headers; loss of SEO is acceptable for a private
// chat page.

const COLORS = {
  burgundy: "#6b1e2e",
  burgundyDeep: "#4a1520",
  ivory: "#fdf6ec",
  ivoryAlt: "#fffaf4",
  border: "#e8d8c4",
  borderSoft: "#f0e4d0",
  text: "#2c1810",
  textSoft: "#7a5a48",
  textMuted: "#b09080",
  gold: "#b8852a",
};

const S = {
  page: { background: COLORS.ivory, minHeight: "100vh", color: COLORS.text, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0.75rem 1.25rem", background: COLORS.ivoryAlt,
    borderBottom: `0.5px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 5,
  },
  back: { color: COLORS.burgundy, textDecoration: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 },
  venueCard: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "0.9rem 1.25rem", background: COLORS.ivoryAlt,
    borderBottom: `0.5px solid ${COLORS.border}`,
  },
  venueImg: { width: 56, height: 56, borderRadius: 12, objectFit: "cover", background: "#f0e2c8", flexShrink: 0 },
  venueImgFallback: {
    width: 56, height: 56, borderRadius: 12, background: "#f0e2c8",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
  },
  venueInfo: { minWidth: 0, flex: 1 },
  venueName: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, fontWeight: 500, color: COLORS.text, marginBottom: 2 },
  venueMeta: { fontSize: 12, color: COLORS.textSoft, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  pillBurg: { background: COLORS.burgundy, color: COLORS.ivory, fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" },
  list: { flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column-reverse", gap: 8 },
  listInner: { display: "flex", flexDirection: "column", gap: 8 },
  empty: { textAlign: "center", color: COLORS.textMuted, fontSize: 13, padding: "2rem 1rem", lineHeight: 1.6 },
  bubbleRowR: { display: "flex", justifyContent: "flex-end" },
  bubbleRowL: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 },
  senderLabel: { fontSize: 11, color: COLORS.textMuted, marginLeft: 4 },
  bubbleCouple: {
    maxWidth: "75%", background: COLORS.burgundy, color: COLORS.ivory,
    padding: "9px 13px", borderRadius: "16px 16px 4px 16px", fontSize: 14, lineHeight: 1.45,
    whiteSpace: "pre-wrap", wordBreak: "break-word",
  },
  bubbleVenue: {
    maxWidth: "75%", background: "#ffffff", color: COLORS.text,
    border: `1px solid ${COLORS.burgundy}`,
    padding: "9px 13px", borderRadius: "16px 16px 16px 4px", fontSize: 14, lineHeight: 1.45,
    whiteSpace: "pre-wrap", wordBreak: "break-word",
  },
  bubbleTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  bubbleTimeR: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: "right" },
  inputBar: {
    display: "flex", gap: 8, alignItems: "center",
    padding: "0.85rem 1rem", background: COLORS.ivoryAlt,
    borderTop: `0.5px solid ${COLORS.border}`,
  },
  input: {
    flex: 1, height: 40, padding: "0 14px", borderRadius: 100,
    border: `0.5px solid ${COLORS.border}`, background: "#f7edda", color: COLORS.text,
    fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: "50%", background: COLORS.burgundy,
    border: "none", color: COLORS.ivory, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  sendBtnDisabled: {
    width: 40, height: 40, borderRadius: "50%", background: "#d6c8b8",
    border: "none", color: COLORS.ivory, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "not-allowed", flexShrink: 0,
  },
  loginBox: {
    margin: "2rem auto", maxWidth: 420, padding: "1.5rem",
    background: COLORS.ivoryAlt, border: `0.5px solid ${COLORS.border}`, borderRadius: 14,
    textAlign: "center",
  },
  loginBtn: {
    display: "inline-block", marginTop: 12, padding: "10px 22px",
    background: COLORS.burgundy, color: COLORS.ivory, borderRadius: 100,
    textDecoration: "none", fontSize: 14, fontWeight: 500,
  },
  errorBox: {
    margin: "1rem", padding: "0.75rem 1rem",
    background: "#fdecea", border: "0.5px solid #f5c6c0", color: "#a52a2a",
    borderRadius: 10, fontSize: 13, textAlign: "center",
  },
};

function formatEventDate(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch (_) {
    return null;
  }
}

export default function VenueChatPage({ conversationId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef(null);
  const listInnerRef = useRef(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const authHeader = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  });

  const fetchConversationMeta = useCallback(async () => {
    // Pull the conversation document from the couple's conversations list so
    // we can show venue name, image, event date, and guest count.
    try {
      const res = await fetch(`${apiBase}/conversations/couple`, {
        method: "GET",
        headers: authHeader(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const match = (data?.conversations || []).find((c) => c?._id === conversationId);
      if (match) setConversation(match);
    } catch (e) {
      // Silently ignore — meta is best-effort and the chat still works without it.
    }
  }, [apiBase, conversationId]);

  const fetchMessages = useCallback(
    async ({ showSpinner = false } = {}) => {
      if (!conversationId) return;
      if (showSpinner) setLoading(true);
      try {
        const res = await fetch(`${apiBase}/conversations/${conversationId}/messages`, {
          method: "GET",
          headers: authHeader(),
        });
        if (!res.ok) {
          if (showSpinner) {
            setError(res.status === 401 ? "Please sign in to view this conversation." : "Could not load messages.");
          }
          return;
        }
        const data = await res.json();
        setMessages(Array.isArray(data?.messages) ? data.messages : []);
        setError("");
      } catch (e) {
        if (showSpinner) setError("Could not load messages. Please check your connection.");
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [apiBase, conversationId]
  );

  const markRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await fetch(`${apiBase}/conversations/${conversationId}/read`, {
        method: "PATCH",
        headers: authHeader(),
      });
    } catch (_) {
      // Non-critical
    }
  }, [apiBase, conversationId]);

  // Initial auth + data load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    setLoggedIn(Boolean(token));
    setAuthChecked(true);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMessages({ showSpinner: true });
    fetchConversationMeta();
    markRead();
  }, [fetchMessages, fetchConversationMeta, markRead]);

  // Poll every 5 seconds while page is mounted and user is logged in
  useEffect(() => {
    if (!loggedIn || !conversationId) return undefined;
    pollRef.current = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [loggedIn, conversationId, fetchMessages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${apiBase}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ text: trimmed, senderType: "couple" }),
      });
      if (!res.ok) {
        setError("Message could not be sent. Please try again.");
        return;
      }
      const data = await res.json();
      const newMsg = data?.message;
      if (newMsg) {
        setMessages((prev) => {
          // Optimistic upsert
          if (prev.some((m) => m?._id === newMsg._id)) return prev;
          return [newMsg, ...prev];
        });
      } else {
        // Fall back to a refetch
        fetchMessages();
      }
      setText("");
      setError("");
    } catch (e) {
      setError("Message could not be sent. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  // Not logged in state
  if (authChecked && !loggedIn) {
    return (
      <main style={S.page}>
        <div style={S.topbar}>
          <Link href="/chats" style={S.back}>← Back to chats</Link>
        </div>
        <div style={S.loginBox}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.text, marginBottom: 6 }}>
            Please sign in to view this conversation
          </div>
          <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.5 }}>
            Your venue messages are private to your account.
          </div>
          <Link href="/login" style={S.loginBtn}>Sign in</Link>
        </div>
      </main>
    );
  }

  const venue = conversation?.venueId || {};
  const enquiry = conversation?.enquiryId || {};
  const eventDate = formatEventDate(enquiry?.eventDate);
  const guestCount = enquiry?.guestCount;
  const venueImage = Array.isArray(venue?.images) && venue.images.length > 0 ? venue.images[0] : null;

  return (
    <main style={S.page}>
      {/* Top bar */}
      <div style={S.topbar}>
        <Link href="/chats" style={S.back}>
          <MdOutlineKeyboardBackspace /> Back to chats
        </Link>
      </div>

      {/* Venue info card */}
      <div style={S.venueCard}>
        {venueImage ? (
          <img src={venueImage} alt={venue?.name || "Venue"} style={S.venueImg} />
        ) : (
          <div style={S.venueImgFallback}>🏡</div>
        )}
        <div style={S.venueInfo}>
          <div style={S.venueName}>{venue?.name || "Venue"}</div>
          <div style={S.venueMeta}>
            <span style={S.pillBurg}>Venue</span>
            {eventDate && <span>📅 {eventDate}</span>}
            {guestCount ? <span>👥 {guestCount} guests</span> : null}
          </div>
        </div>
      </div>

      {error && <div style={S.errorBox}>{error}</div>}

      {/* Message list (column-reverse so newest at bottom, oldest at top) */}
      <div style={S.list}>
        <div style={S.listInner} ref={listInnerRef}>
          {loading ? (
            <div style={S.empty}>Loading messages…</div>
          ) : messages.length === 0 ? (
            <div style={S.empty}>
              No messages yet. Say hello to the venue to get the conversation going.
            </div>
          ) : (
            messages.map((msg) => {
              const isCouple = msg?.senderType === "couple";
              const body = msg?.content?.text || "";
              const time = formatMessageTime(msg?.createdAt);
              if (isCouple) {
                return (
                  <div key={msg?._id} style={S.bubbleRowR}>
                    <div>
                      <div style={S.bubbleCouple}>{body}</div>
                      <div style={S.bubbleTimeR}>{time}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={msg?._id} style={S.bubbleRowL}>
                  {venue?.name && <div style={S.senderLabel}>{venue.name}</div>}
                  <div style={S.bubbleVenue}>{body}</div>
                  <div style={S.bubbleTime}>{time}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Composer */}
      <div style={S.inputBar}>
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={S.input}
          disabled={sending}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !text.trim()}
          style={sending || !text.trim() ? S.sendBtnDisabled : S.sendBtn}
          aria-label="Send message"
        >
          <VscSend size={18} />
        </button>
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  // Just pass the conversationId through. Messages and conversation meta are
  // loaded client-side because the API requires the couple's localStorage
  // token, which is not available during SSR. See the comment at the top of
  // this file.
  return { props: { conversationId: params?.conversationId || null } };
}
