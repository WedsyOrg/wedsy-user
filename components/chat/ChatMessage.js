import { toPriceString } from "@/utils/text";
import { useEffect, useState } from "react";

export default function ChatMessage({
  chat,
  index,
  user,
  fetchChatMessages,
  conversation,
  paymentRequired,
  blockingMessageId,
  showGlobalCta,
}) {
  const [order, setOrder] = useState(null);
  const [bidding, setBidding] = useState(null);
  function fetchOrder() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${chat?.other?.order}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setOrder(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  function fetchBidding() {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bidding/${chat?.other?.bidding}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setBidding(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };
  const makePayment = async ({ order_id, amount }) => {
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }
    var options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      name: "Wedsy",
      currency: "INR",
      amount: amount,
      order_id: order_id,
      description: "Your Event Payment",
      handler: function (response) {
        UpdatePayment({ order_id, response });
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      UpdatePayment({ order_id, response: response.error });
    });
    paymentObject.open();
  };
  const CreatePayment = (_id, amount) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        order: _id,
        paymentFor: "makeup-and-beauty",
        paymentMethod: "razporpay",
        amount: amount,
      }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response?.message === "success") {
          makePayment({ order_id: response.order_id, amount: response.amount });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdatePayment = ({ response, order_id }) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ response }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response?.message === "success") {
          AcceptBiddingBid(order_id);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const AcceptBiddingBid = (order_id) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chat?.chat}/content/${chat?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          other: {
            ...chat?.other,
            rejected: false,
            accepted: true,
            order: order_id,
          },
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchChatMessages();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const DeclineBiddingBid = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chat?.chat}/content/${chat?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          other: { ...chat?.other, rejected: true, accepted: false },
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          fetchChatMessages();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const CreateBiddingOrder = (events, vendor, bid) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
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
    })
      .then((response) => response.json())
      .then((response) => {
        if (response?.message === "success") {
          CreatePayment(response.id, response.amount);
        } else {
          alert("Please try again later");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    if (chat?.contentType === "PersonalPackageAccepted" && chat?.other?.order) {
      fetchOrder();
    } else if (
      (chat?.contentType === "BiddingBid" ||
        chat?.contentType === "BiddingOffer") &&
      chat?.other?.bidding
    ) {
      fetchBidding();
    }
  }, [chat]);

  if (chat?.contentType === "Text") {
    if (chat?.sender?.role === "user") {
      return (
        <div className="px-4 py-2 bg-[#840032] text-white rounded-2xl rounded-br-sm max-w-[70%] self-end">
          {chat?.content}
        </div>
      );
    } else if (chat?.sender?.role === "vendor") {
      return (
        <div className="px-4 py-2 bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm max-w-[70%] self-start">
          {chat?.content}
        </div>
      );
    }
  } else if (chat?.contentType === "PersonalPackageAccepted") {
    return (
      <>
        {order?._id && order?.amount?.due === 0 && (
          <div className="bg-[#22C55E] text-white text-center py-3 rounded-lg font-medium">
            Congratulations! Booking confirmed 🎉
          </div>
        )}
        {order?._id && order?.amount?.due > 0 && !showGlobalCta && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 max-w-sm self-start">
            <p className="text-sm text-gray-600 mb-3">Here's your custom offer</p>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Package price</p>
              <p className="text-3xl font-bold text-gray-900">
                {toPriceString(order?.amount?.total)}
              </p>
            </div>
            <button
              className="w-full text-sm text-[#840032] font-medium underline mb-4"
            >
              View details
            </button>
          </div>
        )}
      </>
    );
  } else if (chat?.contentType === "BiddingBid") {
    return (
      <>
        {chat?.other?.rejected && (
          <div className="bg-gray-500 text-white text-center py-3 rounded-lg font-medium">
            Offer Declined
          </div>
        )}
        {chat?.other?.accepted && chat?.other?.order && (
          <div className="bg-[#22C55E] text-white text-center py-3 rounded-lg font-medium">
            Congratulations! Booking confirmed 🎉
          </div>
        )}
        {!chat?.other?.accepted && !chat?.other?.rejected && !showGlobalCta && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 max-w-sm self-start">
            <p className="text-sm text-gray-600 mb-3">Here's your custom offer</p>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Offer received</p>
              <p className="text-3xl font-bold text-gray-900">
                {toPriceString(
                  bidding?.bids?.find(
                    (item) => item?._id === chat?.other?.biddingBid
                  )?.bid
                )}
              </p>
            </div>
            <button
              className="w-full text-sm text-[#840032] font-medium underline mb-4"
            >
              View details
            </button>
            {((paymentRequired && blockingMessageId === chat?._id) ||
              !conversation?.canUserMessage) && (
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    DeclineBiddingBid();
                  }}
                >
                  Decline
                </button>
                <button
                  className="flex-1 rounded-lg bg-black py-2.5 text-white text-sm font-semibold hover:bg-gray-900"
                  onClick={() => {
                    CreateBiddingOrder(
                      bidding?.events,
                      bidding?.bids?.find(
                        (item) => item?._id === chat?.other?.biddingBid
                      )?.vendor?._id,
                      bidding?.bids?.find(
                        (item) => item?._id === chat?.other?.biddingBid
                      )?.bid
                    );
                  }}
                >
                  Accept & Pay
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  } else if (chat?.contentType === "BiddingOffer") {
    return (
      <>
        {chat?.other?.rejected && (
          <div className="bg-gray-500 text-white text-center py-3 rounded-lg font-medium">
            Offer Declined
          </div>
        )}
        {chat?.other?.accepted && chat?.other?.order && (
          <div className="bg-[#22C55E] text-white text-center py-3 rounded-lg font-medium">
            Congratulations! Booking confirmed 🎉
          </div>
        )}
        {!(chat?.other?.accepted || chat?.other?.rejected) && !showGlobalCta && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 max-w-sm self-start">
            <p className="text-sm text-gray-600 mb-3">Here's your custom offer</p>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Offer received</p>
              <p className="text-3xl font-bold text-gray-900">
                {toPriceString(parseInt(chat?.content))}
              </p>
            </div>
            <button
              className="w-full text-sm text-[#840032] font-medium underline mb-4"
            >
              View details
            </button>
            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  DeclineBiddingBid();
                }}
              >
                Decline
              </button>
              <button
                className="flex-1 rounded-lg bg-black py-2.5 text-white text-sm font-semibold hover:bg-gray-900"
                onClick={() => {
                  CreateBiddingOrder(
                    chat?.other?.events,
                    bidding?.bids?.find(
                      (item) => item?._id === chat?.other?.biddingBid
                    )?.vendor?._id,
                    parseInt(chat?.content)
                  );
                }}
              >
                Accept & Pay
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}
