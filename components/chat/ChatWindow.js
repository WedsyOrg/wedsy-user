import { formatMessageTime } from "@/utils/chat";
import { toPriceString } from "@/utils/text";
import { Avatar } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ user }) {
  const [chat, setChat] = useState([]);
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { chatId } = router.query;

  const fetchChatMessages = () => {
    if (!chatId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}?read=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setChat(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleSendMessage = () => {
    const trimmed = content.trim();
    if (!trimmed || !chatId) {
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: trimmed, contentType: "Text" }),
    })
      .then((response) => response.json())
      .then(() => {
        setContent("");
        fetchChatMessages();
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]);

  return (
    <>
      <div className="md:col-span-2 h-full w-full hide-scrollbar overflow-y-auto flex flex-col bg-[#f4f4f4]">
        <div class="bg-[#5F5F5F] text-white p-3 font-medium text-xl">
          {chat?.vendor?.name}
        </div>
        <div
          id="chat-container"
          class="flex-1 overflow-y-auto p-2 bg-gray-100 flex flex-col-reverse gap-2 hide-scrollbar"
        >
          {chat?.messages?.map((item, index) => (
            <ChatMessage
              chat={item}
              index={index}
              user={user}
              fetchChatMessages={fetchChatMessages}
              key={item?._id}
            />
          ))}
        </div>
        <div class="p-2 flex items-center gap-2 bg-[#D9D9D9] border-t border-gray-300">
          <input
            id="messageInput"
            type="text"
            placeholder="Send message here..."
            class="flex-1 rounded-full pl-4 focus:outline-0 focus:ring-0 focus:ring-offset-0 pr-6"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            className="p-2 rounded-full bg-[#840032] text-white disabled:bg-[#d1a4b6] disabled:text-white/70"
            disabled={loading || !content.trim()}
            onClick={handleSendMessage}
          >
            <VscSend size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
