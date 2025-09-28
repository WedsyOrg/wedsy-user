import { toPriceString } from "@/utils/text";
import { useEffect, useState } from "react";

export default function ChatMessage({ chat, index, user, fetchChatMessages }) {
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
        if (response.message === "success") {
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
        if (response.message === "success") {
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
        if (response.message === "success") {
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
        <div class="p-2 bg-rose-900 text-white rounded-xl rounded-br-none shadow self-end px-6">
          {chat?.content}
        </div>
      );
    } else if (chat?.sender?.role === "vendor") {
      return (
        <div class="p-2 bg-[#F5F5F5] rounded-xl rounded-bl-none shadow self-start px-6">
          {chat?.content}
        </div>
      );
    }
  } else if (chat?.contentType === "PersonalPackageAccepted") {
    return (
      <>
        {order?._id && order?.amount?.due === 0 && (
          <div className="bg-[#2C7300] text-white text-center py-2">
            Congratulations! Booking confirmed ✅
          </div>
        )}
        {order?._id && order?.amount?.due > 0 && (
          <>
            <div className="border-t w-full" />
            <button
              class="p-2 bg-black text-white rounded-lg shadow self-end px-6"
              onClick={() => {
                CreatePayment(order?._id, order?.amount?.due);
              }}
            >
              Pay now
            </button>
            <div className="border-t w-full" />
          </>
        )}
        <div class="p-2 bg-[#F5F5F5] shadow self-start px-6 underline cursor-pointer">
          View details
          {/* --PendingWork-- */}
        </div>
        <div class="p-2 bg-[#F5F5F5] rounded-xl rounded-bl-none shadow self-start px-6">
          Package price
          <p className="text-2xl font-semibold">
            {toPriceString(order?.amount?.total)}
          </p>
        </div>
        <div className="bg-[#2C7300] text-white text-center py-2">
          Package request accepted
        </div>
      </>
    );
  } else if (chat?.contentType === "BiddingBid") {
    return (
      <>
        {chat?.other?.rejected && (
          <div className="bg-gray-600 text-white text-center py-2">
            Offer Declined
          </div>
        )}
        {chat?.other?.accepted && chat?.other?.order && (
          <div className="bg-[#2C7300] text-white text-center py-2">
            Congratulations! Booking confirmed ✅
          </div>
        )}
        {!(chat?.other?.accepted || chat?.other?.rejected) && (
          <>
            <div className="border-t w-full" />
            <div className="flex flex-row gap-4 justify-end">
              <button
                class="grow md:grow-0 p-2 bg-white text-black rounded-lg shadow px-6"
                onClick={() => {
                  DeclineBiddingBid();
                }}
              >
                Decline
              </button>
              <button
                class="grow md:grow-0 p-2 bg-black text-white rounded-lg shadow px-6"
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
            <div className="border-t w-full" />
          </>
        )}
        <div class="p-2 bg-[#F5F5F5] shadow self-start px-6 underline cursor-pointer">
          View details
          {/* --PendingWork-- */}
        </div>
        <div class="p-2 bg-[#F5F5F5] rounded-xl rounded-bl-none shadow self-start px-6">
          Offer received
          <p className="text-2xl font-semibold">
            {toPriceString(
              bidding?.bids?.find(
                (item) => item?._id === chat?.other?.biddingBid
              )?.bid
            )}
          </p>
        </div>
      </>
    );
  } else if (chat?.contentType === "BiddingOffer") {
    return (
      <>
        {chat?.other?.rejected && (
          <div className="bg-gray-600 text-white text-center py-2">
            Offer Declined
          </div>
        )}
        {chat?.other?.accepted && chat?.other?.order && (
          <div className="bg-[#2C7300] text-white text-center py-2">
            Congratulations! Booking confirmed ✅
          </div>
        )}
        {!(chat?.other?.accepted || chat?.other?.rejected) && (
          <>
            <div className="border-t w-full" />
            <div className="flex flex-row gap-4 justify-end">
              <button
                class="grow md:grow-0 p-2 bg-white text-black rounded-lg shadow px-6"
                onClick={() => {
                  DeclineBiddingBid();
                }}
              >
                Decline
              </button>
              <button
                class="grow md:grow-0 p-2 bg-black text-white rounded-lg shadow px-6"
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
            <div className="border-t w-full" />
          </>
        )}
        <div class="p-2 bg-[#F5F5F5] shadow self-start px-6 underline cursor-pointer">
          View details
          {/* --PendingWork-- */}
        </div>
        <div class="p-2 bg-[#F5F5F5] rounded-xl rounded-bl-none shadow self-start px-6">
          Offer received
          <p className="text-2xl font-semibold">
            {toPriceString(parseInt(chat?.content))}
          </p>
        </div>
        <div className="bg-gray-200 text-center py-2">
          Here’s your custom offer
        </div>
      </>
    );
  }
}
