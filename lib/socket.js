import { io } from "socket.io-client";

let socket = null;

/**
 * Connect (or return the existing) singleton Socket.io client.
 * Uses the JWT in localStorage('token') for auth.
 */
export function connectSocket() {
  if (typeof window === "undefined") return null;
  if (socket && socket.connected) return socket;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.error("[socket] NEXT_PUBLIC_API_URL is not set");
    return null;
  }

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(url, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  socket.on("connect", () => console.log("[socket] connected", socket.id));
  socket.on("disconnect", (reason) =>
    console.log("[socket] disconnected:", reason)
  );
  socket.on("connect_error", (err) =>
    console.warn("[socket] connect_error:", err?.message || err)
  );

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
