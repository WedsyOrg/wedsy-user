import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VscSend } from "react-icons/vsc";
import ChatMessage from "./ChatMessage";
import { toPriceString } from "@/utils/text";

export default function ChatWindow({ user }) {
  const [chat, setChat] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [blockingMessageId, setBlockingMessageId] = useState(null);
  const [blockingMessage, setBlockingMessage] = useState(null);
  const [blockingOrder, setBlockingOrder] = useState(null);
  const [blockingBidding, setBlockingBidding] = useState(null);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaError, setCtaError] = useState("");
  const router = useRouter();
  const { chatId } = router.query;

  const evaluatePaymentStatus = useCallback((chatData) => {
    if (!chatData?.messages?.length) {
      setPaymentRequired(false);
      setPaymentMessage("");
      setBlockingMessageId(null);
      return;
    }

    const blockingTypes = [
      "BiddingOffer",
      "BiddingBid",
      "PersonalPackageAccepted",
    ];

    const blockingMessage = chatData.messages.find((message) =>
      blockingTypes.includes(message?.contentType)
    );

    if (!blockingMessage) {
      setPaymentRequired(false);
      setPaymentMessage("");
      setBlockingMessageId(null);
      return;
    }

    const { contentType, other = {} } = blockingMessage;
    const accepted = Boolean(other.accepted);
    const rejected = Boolean(other.rejected);
    const orderPaid = Boolean(
      other.paymentDone || other.orderPaymentDone || other.paid
    );

    if (
      (!accepted && !rejected) ||
      (contentType === "PersonalPackageAccepted" && (!other.order || !orderPaid))
    ) {
      setPaymentRequired(true);
      setPaymentMessage(
        contentType === "PersonalPackageAccepted"
          ? "Please complete the payment for your package to continue chatting."
          : "Complete the payment for the latest offer to continue chatting."
      );
      setBlockingMessageId(blockingMessage?._id || null);
      return;
    }

    setPaymentRequired(false);
    setPaymentMessage("");
    setBlockingMessageId(null);
    setBlockingMessage(null);
    setBlockingOrder(null);
    setBlockingBidding(null);
  }, []);

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
        const normalized = {
          ...response,
          canUserMessage: Boolean(response?.canUserMessage),
        };
        setChat(normalized);
        evaluatePaymentStatus(normalized);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  };

  const handleSendMessage = () => {
    const trimmed = content.trim();
    if (!trimmed || !chatId) {
      return;
    }
    if (paymentRequired) {
      setSendError(
        paymentMessage || "Payment required before sending messages."
      );
      return;
    }
    setLoading(true);
    setSendError("");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: trimmed, contentType: "Text" }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 403 && data?.message === "payment_required") {
            setPaymentRequired(true);
            setPaymentMessage(
              data?.error ||
                "Complete the payment for the latest offer to continue chatting."
            );
            setSendError(
              data?.error || "Payment required before sending messages."
            );
          } else {
            setSendError(
              data?.error || data?.message || "Unable to send message."
            );
          }
          throw new Error(
            data?.error || data?.message || "Unable to send message."
          );
        }
        return data;
      })
      .then(() => {
        setContent("");
        fetchChatMessages();
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!paymentRequired || !blockingMessageId || !chat?.messages) {
      setBlockingMessage(null);
      return;
    }
    const found = chat.messages.find((msg) => msg?._id === blockingMessageId);
    setBlockingMessage(found || null);
  }, [paymentRequired, blockingMessageId, chat]);

  const fetchOrder = useCallback(async (orderId) => {
    if (!orderId) return null;
    if (blockingOrder?._id === orderId) return blockingOrder;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBlockingOrder(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      return null;
    }
  }, [blockingOrder]);

  const fetchBidding = useCallback(async (biddingId) => {
    if (!biddingId) return null;
    if (blockingBidding?._id === biddingId) return blockingBidding;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bidding/${biddingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBlockingBidding(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch bidding details:", error);
      return null;
    }
  }, [blockingBidding]);

  useEffect(() => {
    if (!blockingMessage) return;
    if (blockingMessage.contentType === "PersonalPackageAccepted" && blockingMessage?.other?.order) {
      fetchOrder(blockingMessage.other.order);
    } else if ((blockingMessage.contentType === "BiddingOffer" || blockingMessage.contentType === "BiddingBid") && blockingMessage?.other?.bidding) {
      fetchBidding(blockingMessage.other.bidding);
    }
  }, [blockingMessage, fetchOrder, fetchBidding]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updatePayment = async ({ order_id, response }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${order_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ response }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.message === "success";
    } catch (error) {
      console.error("Failed to update payment:", error);
      return false;
    }
  };

  const makePayment = async ({ order_id, amount }) => {
    const ready = await initializeRazorpay();
    if (!ready) {
      alert("Razorpay SDK Failed to load");
      return false;
    }
    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        name: "Wedsy",
        currency: "INR",
        amount,
        order_id,
        description: "Your Event Payment",
        handler: async function (response) {
          const success = await updatePayment({ order_id, response });
          resolve(success);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", async function (response) {
        await updatePayment({ order_id, response: response.error });
        resolve(false);
      });
      paymentObject.open();
    });
  };

  const createPayment = async ({ orderId, amount }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order: orderId,
          paymentFor: "makeup-and-beauty",
          paymentMethod: "razporpay",
          amount,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.message === "success") {
        return makePayment({ order_id: data.order_id, amount: data.amount });
      }
      return false;
    } catch (error) {
      console.error("Create payment failed:", error);
      return false;
    }
  };

  const createBiddingOrder = async ({ events, vendor, bid }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          source: "Bidding",
          events,
          vendor,
          bid,
        }),
      });
      const data = await res.json();
      if (data?.message === "success") {
        return createPayment({ orderId: data.id, amount: data.amount });
      }
      alert("Please try again later");
      return false;
    } catch (error) {
      console.error("Create bidding order failed:", error);
      return false;
    }
  };

  const handlePayNow = async () => {
    if (!blockingMessage) return;
    setCtaError("");
    setCtaLoading(true);
    let success = false;
    try {
      if (blockingMessage.contentType === "PersonalPackageAccepted") {
        const order = await fetchOrder(blockingMessage?.other?.order);
        const due = order?.amount?.due ?? 0;
        if (order?._id && due > 0) {
          success = await createPayment({ orderId: order._id, amount: due });
        }
      } else {
        const bidding = await fetchBidding(blockingMessage?.other?.bidding);
        if (bidding) {
          const bidDoc = bidding?.bids?.find((item) => item?._id === blockingMessage?.other?.biddingBid);
          const vendorId = bidDoc?.vendor?._id;
          const amount =
            blockingMessage.contentType === "BiddingOffer"
              ? parseInt(blockingMessage?.content, 10)
              : bidDoc?.bid;
          if (vendorId && amount) {
            success = await createBiddingOrder({
              events:
                blockingMessage.contentType === "BiddingOffer"
                  ? blockingMessage?.other?.events
                  : bidding?.events,
              vendor: vendorId,
              bid: amount,
            });
          }
        }
      }
      if (!success) {
        setCtaError("Payment could not be initiated. Please try again.");
      }
    } catch (error) {
      console.error("Payment flow failed:", error);
      setCtaError("Payment could not be initiated. Please try again.");
    } finally {
      setCtaLoading(false);
      await fetchChatMessages();
    }
  };

  const declineBlockingOffer = async () => {
    if (!blockingMessage) return;
    try {
      setCtaLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${blockingMessage.chat}/content/${blockingMessage._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          other: {
            ...blockingMessage.other,
            rejected: true,
            accepted: false,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.message === "success") {
          await fetchChatMessages();
        }
      }
    } catch (error) {
      console.error("Decline offer failed:", error);
    } finally {
      setCtaLoading(false);
    }
  };

  const showGlobalCta = Boolean(paymentRequired && blockingMessage);

  const blockingAmount = useMemo(() => {
    if (!blockingMessage) return null;
    if (blockingMessage.contentType === "PersonalPackageAccepted") {
      return blockingOrder?.amount?.due ?? null;
    }
    if (blockingMessage.contentType === "BiddingOffer") {
      return parseInt(blockingMessage.content, 10);
    }
    if (blockingMessage.contentType === "BiddingBid") {
      const bid = blockingBidding?.bids?.find((item) => item?._id === blockingMessage?.other?.biddingBid)?.bid;
      return bid || null;
    }
    return null;
  }, [blockingMessage, blockingOrder, blockingBidding]);

  return (
    <>
      <div className="md:col-span-2 h-full w-full hide-scrollbar overflow-y-auto flex flex-col bg-[#f4f4f4]">
        <div className="bg-[#5F5F5F] text-white p-3 font-medium text-xl">
          {chat?.vendor?.name}
        </div>
        <div
          id="chat-container"
          className="flex-1 overflow-y-auto p-2 bg-gray-100 flex flex-col-reverse gap-2 hide-scrollbar"
        >
          {chat?.messages?.map((item, index) => (
            <ChatMessage
              chat={item}
              index={index}
              user={user}
              fetchChatMessages={fetchChatMessages}
              conversation={chat}
              paymentRequired={paymentRequired}
              blockingMessageId={blockingMessageId}
              showGlobalCta={showGlobalCta && blockingMessageId === item?._id}
              key={item?._id}
            />
          ))}
        </div>
        <div className="p-2 flex flex-col md:flex-row md:items-center gap-2 bg-[#D9D9D9] border-t border-gray-300">
          {(paymentRequired || sendError) && (
            <div className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-red-700">
              {paymentMessage || sendError}
            </div>
          )}
          <div className="w-full flex flex-row gap-2">
            <input
              id="messageInput"
              type="text"
              placeholder={
                paymentRequired
                  ? "Complete payment to continue chatting"
                  : "Send message here..."
              }
              className="flex-1 rounded-full pl-4 focus:outline-0 focus:ring-0 focus:ring-offset-0 pr-6"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (sendError) {
                  setSendError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={paymentRequired || loading}
            />
            <button
              className="p-2 rounded-full bg-[#840032] text-white disabled:bg-[#d1a4b6] disabled:text-white/70"
              disabled={loading || !content.trim() || paymentRequired}
              onClick={handleSendMessage}
            >
              <VscSend size={24} />
            </button>
          </div>
        </div>
        {showGlobalCta && (
          <div className="px-4 py-6 bg-white border-b border-gray-200 space-y-4">
            <div className="text-center text-xs tracking-wide text-gray-500">
              Request accepted by the artist
            </div>
            <div className="mx-auto max-w-xs rounded-2xl bg-[#f5f5f5] p-4 text-center shadow">
              <p className="text-sm text-gray-600">Offer received</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blockingAmount !== null ? toPriceString(blockingAmount) : "--"}
              </p>
            </div>
            <button
              className="mx-auto text-sm font-medium underline text-gray-700"
              onClick={() => {
                const element = document.getElementById("chat-container");
                if (element) {
                  element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
                }
              }}
            >
              View details
            </button>
            {ctaError && <div className="text-center text-sm text-red-600">{ctaError}</div>}
            <div className="flex flex-col gap-3">
              <button
                className="w-full rounded-md bg-black py-3 text-white text-sm font-semibold disabled:bg-gray-500"
                onClick={handlePayNow}
                disabled={ctaLoading}
              >
                {ctaLoading ? "Processing..." : "Pay now"}
              </button>
              <button
                className="w-full rounded-md border border-gray-300 py-3 text-sm font-semibold text-gray-700 disabled:opacity-60"
                onClick={declineBlockingOffer}
                disabled={ctaLoading}
              >
                Decline offer
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
