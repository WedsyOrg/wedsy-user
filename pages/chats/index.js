import ChatSideBar from "@/components/chat/ChatSideBar";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { formatMessageTime } from "@/utils/chat";

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
  goldSoft: "#e8c47a",
};

const S = {
  shell: { background: COLORS.ivory, minHeight: "100vh", color: COLORS.text },
  header: {
    background: COLORS.ivoryAlt,
    padding: "1rem 1.5rem",
    borderBottom: `0.5px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  title: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: COLORS.text, margin: 0 },
  tabsRow: {
    display: "flex",
    gap: 8,
    padding: "0.85rem 1.25rem",
    background: COLORS.ivoryAlt,
    borderBottom: `0.5px solid ${COLORS.border}`,
    position: "sticky",
    top: 56,
    zIndex: 4,
    flexWrap: "wrap",
  },
  tab: {
    padding: "7px 16px",
    borderRadius: 100,
    border: `0.5px solid ${COLORS.border}`,
    background: COLORS.ivoryAlt,
    color: COLORS.textSoft,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
  },
  tabActive: {
    padding: "7px 16px",
    borderRadius: 100,
    border: `0.5px solid ${COLORS.burgundy}`,
    background: COLORS.burgundy,
    color: COLORS.ivory,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
  },
  list: { padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: 10, maxWidth: 720, margin: "0 auto" },
  card: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    background: COLORS.ivoryAlt,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: "1rem",
    transition: "transform 0.15s ease, border-color 0.15s ease",
  },
  cardTop: { display: "flex", alignItems: "flex-start", gap: 12 },
  cardImg: { width: 56, height: 56, borderRadius: 10, objectFit: "cover", background: "#f0e2c8", flexShrink: 0 },
  cardImgFallback: {
    width: 56,
    height: 56,
    borderRadius: 10,
    background: "#f0e2c8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    flexShrink: 0,
  },
  cardBody: { minWidth: 0, flex: 1 },
  rowOne: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 },
  name: { fontSize: 15, fontWeight: 500, color: COLORS.text, marginRight: "auto", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  pillBurg: { background: COLORS.burgundy, color: COLORS.ivory, fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" },
  pillMua: { background: "#FF307E", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 500, letterSpacing: 0.4, textTransform: "uppercase" },
  time: { fontSize: 11, color: COLORS.textMuted, flexShrink: 0 },
  unread: {
    background: COLORS.goldSoft,
    color: COLORS.burgundyDeep,
    fontSize: 10,
    minWidth: 18,
    height: 18,
    padding: "0 6px",
    borderRadius: 100,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  preview: { fontSize: 13, color: COLORS.textSoft, lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" },
  previewMuted: { fontSize: 13, color: COLORS.burgundy, fontStyle: "italic" },
  metaRow: { marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: COLORS.textMuted },
  empty: { padding: "3rem 1.5rem", textAlign: "center", color: COLORS.textSoft, fontSize: 14, lineHeight: 1.6 },
  emptyTitle: { fontSize: 17, color: COLORS.text, marginBottom: 6, fontFamily: "Georgia, 'Times New Roman', serif" },
  exploreBtn: {
    display: "inline-block",
    marginTop: 14,
    padding: "9px 20px",
    background: COLORS.burgundy,
    color: COLORS.ivory,
    borderRadius: 100,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
  },
  loading: { padding: "2rem", textAlign: "center", color: COLORS.textMuted, fontSize: 13 },
  error: {
    margin: "1rem auto",
    maxWidth: 720,
    padding: "0.75rem 1rem",
    background: "#fdecea",
    border: "0.5px solid #f5c6c0",
    color: "#a52a2a",
    borderRadius: 10,
    fontSize: 13,
    textAlign: "center",
  },
  loginBox: {
    margin: "2rem auto",
    maxWidth: 460,
    padding: "1.75rem 1.5rem",
    background: COLORS.ivoryAlt,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: 14,
    textAlign: "center",
  },
  loginBtn: {
    display: "inline-block",
    marginTop: 14,
    padding: "10px 22px",
    background: COLORS.burgundy,
    color: COLORS.ivory,
    borderRadius: 100,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  muaWrap: { maxWidth: 1200, margin: "0 auto", padding: "0 0.5rem" },
  comingSoon: { padding: "3rem 1.5rem", textAlign: "center", color: COLORS.textSoft, fontSize: 14 },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "venues", label: "Venues" },
  { key: "mua", label: "MUA" },
];

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

function VenueConversationCard({ conv }) {
  const venue = conv?.venueId || {};
  const enquiry = conv?.enquiryId || {};
  const lastMsg = conv?.lastMessage;
  const imageSrc = Array.isArray(venue?.images) && venue.images.length > 0 ? venue.images[0] : null;
  const eventDate = formatEventDate(enquiry?.eventDate);
  const guestCount = enquiry?.guestCount;
  const time = formatMessageTime(lastMsg?.createdAt || conv?.createdAt);
  const unread = conv?.unreadCountCouple || 0;

  return (
    <Link href={`/chats/venue/${conv?._id}`} style={S.card}>
      <div style={S.cardTop}>
        {imageSrc ? (
          <img src={imageSrc} alt={venue?.name || "Venue"} style={S.cardImg} />
        ) : (
          <div style={S.cardImgFallback}>🏡</div>
        )}
        <div style={S.cardBody}>
          <div style={S.rowOne}>
            <span style={S.name}>{venue?.name || "Venue"}</span>
            <span style={S.pillBurg}>Venue</span>
            <span style={S.time}>{time}</span>
            {unread > 0 && <span style={S.unread}>{unread}</span>}
          </div>
          {lastMsg?.content?.text ? (
            <div style={S.preview}>
              {lastMsg?.senderType === "couple" ? "You: " : ""}
              {lastMsg.content.text}
            </div>
          ) : (
            <div style={S.previewMuted}>Start the conversation →</div>
          )}
          <div style={S.metaRow}>
            {eventDate && <span>📅 {eventDate}</span>}
            {guestCount ? <span>👥 {guestCount} guests</span> : null}
            {venue?.city && <span>📍 {venue.city}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MuaConversationCard({ chat }) {
  const cover = chat?.vendor?.gallery?.coverPhoto;
  const time = formatMessageTime(chat?.lastMessage?.createdAt || chat?.updatedAt);
  const unread = chat?.unreadCount || 0;
  return (
    <Link href={`/chats/${chat?._id}`} style={S.card}>
      <div style={S.cardTop}>
        {cover ? (
          <img src={cover} alt={chat?.vendor?.name || "Artist"} style={S.cardImg} />
        ) : (
          <div style={S.cardImgFallback}>💄</div>
        )}
        <div style={S.cardBody}>
          <div style={S.rowOne}>
            <span style={S.name}>{chat?.vendor?.name || "Makeup artist"}</span>
            <span style={S.pillMua}>MUA</span>
            <span style={S.time}>{time}</span>
            {unread > 0 && <span style={S.unread}>{unread}</span>}
          </div>
          {chat?.lastMessage?.content ? (
            <div style={S.preview}>{chat.lastMessage.content}</div>
          ) : (
            <div style={S.previewMuted}>Start the conversation →</div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ChatsInbox() {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [venueLoading, setVenueLoading] = useState(true);
  const [venueError, setVenueError] = useState("");
  const [venueConvs, setVenueConvs] = useState([]);

  const [muaLoading, setMuaLoading] = useState(true);
  const [muaError, setMuaError] = useState("");
  const [muaChats, setMuaChats] = useState([]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const authHeader = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  });

  const fetchVenueConversations = useCallback(async () => {
    setVenueLoading(true);
    try {
      const res = await fetch(`${apiBase}/conversations/couple`, {
        method: "GET",
        headers: authHeader(),
      });
      if (!res.ok) {
        setVenueError(res.status === 401 ? "Please sign in to view your conversations." : "Could not load venue conversations.");
        setVenueConvs([]);
        return;
      }
      const data = await res.json();
      setVenueConvs(Array.isArray(data?.conversations) ? data.conversations : []);
      setVenueError("");
    } catch (e) {
      setVenueError("Could not load venue conversations. Please check your connection.");
    } finally {
      setVenueLoading(false);
    }
  }, [apiBase]);

  const fetchMuaChats = useCallback(async () => {
    setMuaLoading(true);
    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "GET",
        headers: authHeader(),
      });
      if (!res.ok) {
        setMuaError("");
        setMuaChats([]);
        return;
      }
      const data = await res.json();
      setMuaChats(Array.isArray(data) ? data : []);
      setMuaError("");
    } catch (e) {
      setMuaError("");
    } finally {
      setMuaLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    setLoggedIn(Boolean(token));
    setAuthChecked(true);
    if (!token) {
      setVenueLoading(false);
      setMuaLoading(false);
      return;
    }
    fetchVenueConversations();
    fetchMuaChats();
  }, [fetchVenueConversations, fetchMuaChats]);

  const interleaved = useMemo(() => {
    const venueItems = venueConvs.map((c) => ({
      kind: "venue",
      id: c?._id,
      sortKey: new Date(c?.lastMessageAt || c?.lastMessage?.createdAt || c?.createdAt || 0).getTime(),
      data: c,
    }));
    const muaItems = muaChats.map((c) => ({
      kind: "mua",
      id: c?._id,
      sortKey: new Date(c?.lastMessage?.createdAt || c?.updatedAt || c?.createdAt || 0).getTime(),
      data: c,
    }));
    return [...venueItems, ...muaItems].sort((a, b) => b.sortKey - a.sortKey);
  }, [venueConvs, muaChats]);

  // Not signed in
  if (authChecked && !loggedIn) {
    return (
      <main style={S.shell}>
        <div style={S.header}>
          <h1 style={S.title}>Chats</h1>
        </div>
        <div style={S.loginBox}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: COLORS.text, marginBottom: 6, fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Sign in to see your chats
          </div>
          <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.5 }}>
            Your conversations with venues and makeup artists live here.
          </div>
          <Link href="/login" style={S.loginBtn}>Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={S.shell}>
      <div style={S.header}>
        <MdOutlineKeyboardBackspace
          style={{ cursor: "pointer", color: COLORS.text }}
          onClick={() => router.back()}
        />
        <h1 style={S.title}>Chats</h1>
      </div>

      <div style={S.tabsRow}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={tab === t.key ? S.tabActive : S.tab}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "venues" && (
        <div style={S.list}>
          {venueError && <div style={S.error}>{venueError}</div>}
          {venueLoading ? (
            <div style={S.loading}>Loading your venue conversations…</div>
          ) : venueConvs.length === 0 ? (
            <div style={S.empty}>
              <div style={S.emptyTitle}>No venue conversations yet</div>
              <div>Explore venues to start a conversation.</div>
              <Link href="/venues" style={S.exploreBtn}>Explore venues →</Link>
            </div>
          ) : (
            venueConvs.map((conv) => <VenueConversationCard key={conv?._id} conv={conv} />)
          )}
        </div>
      )}

      {tab === "mua" && (
        <div style={S.muaWrap}>
          {/* Preserve existing MUA chat experience. The ChatSideBar component
              powers the previous MUA chat listing (and the /chats/[chatId]
              detail page links). We mount it inside the MUA tab so the
              existing functionality remains intact. */}
          {muaLoading ? (
            <div style={S.loading}>Loading your makeup artist chats…</div>
          ) : muaChats.length === 0 ? (
            // Fallback path — show the original sidebar so any behavior we
            // didn't account for (search, sockets, etc.) still works.
            <div style={{ minHeight: 400 }}>
              <ChatSideBar />
            </div>
          ) : (
            <div style={{ minHeight: 400 }}>
              <ChatSideBar />
            </div>
          )}
        </div>
      )}

      {tab === "all" && (
        <div style={S.list}>
          {venueError && <div style={S.error}>{venueError}</div>}
          {venueLoading || muaLoading ? (
            <div style={S.loading}>Loading your conversations…</div>
          ) : interleaved.length === 0 ? (
            <div style={S.empty}>
              <div style={S.emptyTitle}>No conversations yet</div>
              <div>Explore venues or browse makeup artists to start chatting.</div>
              <Link href="/venues" style={S.exploreBtn}>Explore venues →</Link>
            </div>
          ) : (
            interleaved.map((item) =>
              item.kind === "venue" ? (
                <VenueConversationCard key={`v-${item.id}`} conv={item.data} />
              ) : (
                <MuaConversationCard key={`m-${item.id}`} chat={item.data} />
              )
            )
          )}
        </div>
      )}
    </main>
  );
}
