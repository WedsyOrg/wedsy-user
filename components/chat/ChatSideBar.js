import { formatMessageTime } from "@/utils/chat";
import { Avatar } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ChatSideBar({}) {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { chatId } = router.query;

  const fetchChats = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setChats(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <div
        className={`hide-scrollbar overflow-y-auto ${
          chatId ? "hidden md:flex" : "flex"
        } flex-col bg-[#f4f4f4]`}
      >
        <div className="relative flex flex-row m-6">
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500"
            aria-label="Search"
          >
            <FaSearch size={16} />
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search by name..."
            className="grow w-full py-2 px-4 text-gray-700 rounded-full border border-gray-300 focus:ring-0 focus:outline-none pl-12"
          />
        </div>
        {chats
          ?.filter((item) =>
            search
              ? item?.vendor?.name.toLowerCase().includes(search.toLowerCase())
              : true
          )
          ?.map((chat) => (
            <div
              className={`flex flex-row items-center space-x-4 px-6 mb-2 ${
                chatId === chat?._id && "bg-[#D9D9D9]"
              }`}
              key={chat?._id}
              onClick={() => {
                router.push(`/chats/${chat?._id}`);
              }}
            >
              <div className="shrink-0 py-2">
                <Avatar
                  img={chat?.vendor?.gallery?.coverPhoto}
                  rounded
                  size={"lg"}
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col py-4 justify-start h-full border-b">
                <div className="flex flex-row mb-auto gap-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white grow">
                    {chat?.vendor?.name}
                  </p>
                  {chat?.lastMessage && (
                    <p className="flex-shrink-0 text-[#FF307E]">
                      {formatMessageTime(chat?.lastMessage?.createdAt)}
                    </p>
                  )}
                </div>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {chat?.lastMessage?.content}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
