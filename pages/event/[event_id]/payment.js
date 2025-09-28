import { checkValidEmail } from "@/utils/email";
import { Label, Modal, Radio, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import paymentSuccessGif from "@/public/assets/gif/payment-success.gif";
import paymentFailureGif from "@/public/assets/gif/payment-failure.gif";
import Link from "next/link";

export default function EventTool({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({});
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentOption, setPaymentOption] = useState("advance-payment");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [eventInfo, setEventInfo] = useState({
    allowAdvancePayment: true,
    earliestDate: "",
  });
  const { event_id } = router.query;
  const [addEmail, setAddEmail] = useState({ email: "", display: false });
  const fetchPayment = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${event_id}?populate=true`,
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
        if (response.message !== "error") {
          if (response.status.approved && !response.status.paymentDone) {
            let tempEventDays = response.eventDays.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            const earliestDate = tempEventDays[0].date;
            const today = new Date();
            const earliestEventDate = new Date(earliestDate);
            const timeDifference =
              earliestEventDate.getTime() - today.getTime();
            const daysDifference = Math.ceil(
              timeDifference / (1000 * 3600 * 24)
            );
            setEventInfo({
              allowAdvancePayment: daysDifference > 10,
              earliestDate: earliestDate,
            });
            if (daysDifference < 10 || response.amount.paid > 0) {
              setPaymentAmount(
                response.amount.paid > 0
                  ? response.amount.due
                  : response.amount.total
              );
              setPaymentOption("full-payment");
            } else {
              setPaymentAmount(Math.ceil(response?.amount.total * 0.2));
            }
            setEvent(response);
          } else {
            router.push(`/event/${event_id}/planner`);
          }
        } else {
          router.push("/event");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        router.push("/event");
      });
  };
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
        setPaymentStatus("success");
        UpdatePayment({ order_id, response });
      },
      prefill: {
        name: user.name,
        email: user.email || addEmail.email,
        contact: user.phonbasee,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      setPaymentStatus("failure");
      UpdatePayment({ order_id, response: response.error });
    });
    paymentObject.open();
  };
  const CreatePayment = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        event: event_id,
        paymentFor: "event",
        paymentMethod: "razporpay",
        amount: paymentAmount,
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
          // makePayment({ order_id: response.order_id, amount: response.amount });
          fetchPayment();
          // alert("Finalized the event!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addUserEmail = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: user.name,
        phone: user.phone,
        email: addEmail.email,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setAddEmail({ display: false });
        CreatePayment();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchPayment();
  }, []);
  return (
    <>
      <Modal
        show={addEmail?.display || false}
        size="lg"
        popup
        onClose={() =>
          setAddEmail({
            email: "",
            display: false,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add your Email.
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <Label value="Your Email Id:" />
            <TextInput
              type="email"
              placeholder="email@example.com"
              value={addEmail?.email}
              onChange={(e) => {
                setAddEmail({ ...addEmail, email: e.target.value });
              }}
              disabled={loading}
            />
          </div>
          <div>
            <button
              className={`text-white bg-rose-900  disabled:bg-rose-700 disabled:cursor-not-allowed border border-rose-900 hover:bg-rose-900 hover:text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none`}
              onClick={() => {
                addUserEmail();
              }}
              disabled={loading || !checkValidEmail(addEmail.email)}
            >
              Add Email
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="relative flex flex-col gap-8 px-6 md:px-24 py-6 md:py-12 min-h-screen">
        <div className="flex flex-row justify-between">
          <Image
            src={"/assets/images/buyer_protection.png"}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            className="h-12 md:h-20 w-auto"
          />
          <Image
            src={"/logo-black.png"}
            alt="Decor"
            width={0}
            height={0}
            sizes="100%"
            className="h-8 md:h-12 w-auto"
          />
        </div>
        <p className="flex flex-row justify-between pb-2 font-semibold text-2xl">
          Payment page
        </p>
        {paymentStatus === null ? (
          <>
            <p className="flex flex-row justify-between pb-2 font-medium text-xl">
              Choose payment method style
            </p>
            <div className="flex flex-col gap-6 border-b border-b-black pb-4">
              {event?.amount?.paid === 0 && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-lg">
                    <div className="flex items-center gap-2">
                      <Radio
                        id="advance-payment"
                        name="advance-payment"
                        value="advance-payment"
                        checked={paymentOption === "advance-payment"}
                        onChange={(e) => {
                          setPaymentOption(e.target.value);
                          setPaymentAmount(
                            Math.ceil(event?.amount?.total * 0.2)
                          );
                        }}
                        disabled={!eventInfo.allowAdvancePayment}
                      />
                      <Label htmlFor="advance-payment">
                        Booking amount ( 20% of Total Bill ){" "}
                        {!eventInfo.allowAdvancePayment && (
                          <span className="text-rose-900">
                            Not Allowed as event date is near.
                          </span>
                        )}
                        <br />
                        <span>
                          <span className="text-rose-900">
                            ₹{Math.ceil(event?.amount?.total * 0.2)}
                          </span>{" "}
                          to be paid
                        </span>
                      </Label>
                    </div>
                    <Label className="md:ml-auto">
                      Remaining amount payable:{" "}
                      <span className="text-rose-900">
                        ₹
                        {event?.amount?.total -
                          Math.ceil(event?.amount?.total * 0.2)}
                      </span>
                    </Label>
                  </div>
                </div>
              )}
              {event?.amount?.paid != 0 && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-lg">
                    <div className="flex items-center gap-2">
                      <Radio
                        id="variable-payment"
                        name="variable-payment"
                        value="variable-payment"
                        checked={paymentOption === "variable-payment"}
                        onChange={(e) => {
                          setPaymentOption(e.target.value);
                          setPaymentAmount(event?.amount?.due);
                        }}
                      />
                      <Label htmlFor="advance-payment">
                        Enter amount:
                        <br />
                        <TextInput
                          type="number"
                          max={event?.amount?.due}
                          value={paymentAmount.toString()}
                          onChange={(e) => {
                            setPaymentAmount(
                              (parseInt(e.target.value) || 0) > 0
                                ? parseInt(e.target.value) > event?.amount?.due
                                  ? event?.amount?.due
                                  : parseInt(e.target.value)
                                : 0
                            );
                          }}
                          disabled={paymentOption !== "variable-payment"}
                        />
                      </Label>
                    </div>
                    <Label className="md:ml-auto">
                      Remaining amount payable:{" "}
                      <span className="text-rose-900">
                        ₹{event?.amount?.due - paymentAmount}
                      </span>
                    </Label>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-lg">
                  <Radio
                    id="full-payment"
                    name="full-payment"
                    value="full-payment"
                    checked={paymentOption === "full-payment"}
                    onChange={(e) => {
                      setPaymentOption(e.target.value);
                      setPaymentAmount(
                        event?.amount?.paid === 0
                          ? event?.amount.total
                          : event?.amount?.due
                      );
                    }}
                  />
                  <Label htmlFor="full-payment">
                    {event?.amount?.paid === 0
                      ? "Full Payment"
                      : `Pending Amount: ${(
                          event?.amount?.due || 0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        })}`}
                  </Label>
                </div>
              </div>
            </div>
            <button
              className="font-semibold bg-rose-900 rounded-full p-2 px-16 text-white w-max mx-auto"
              onClick={() => {
                if (user.email) {
                  CreatePayment();
                } else {
                  setAddEmail({ display: true });
                }
              }}
            >
              Pay Now
            </button>
            <p className="text-center">
              Please do not close the window or refresh the page till the
              transaction is complete
            </p>
          </>
        ) : paymentStatus === "success" ? (
          <div className="flex flex-col items-center">
            <p className="text-center pb-2 font-medium text-base">
              Congratulations
            </p>
            <p className="text-center pb-2 font-medium text-sm">
              Your payment has been done successfully!
            </p>
            <div className="">
              <Image
                src={paymentSuccessGif}
                alt="Success"
                width={0}
                height={0}
                sizes="100%"
                className="h-48 w-48"
              />
            </div>
            <Link href={"/"}>
              <button className="font-semibold bg-rose-900 rounded-lg p-2 px-16 text-white w-max mx-auto">
                Back to home screen
              </button>
            </Link>
            <div class="h-16" />
            <div class="-z-10 h-32 w-full bg-gradient-to-t from-[#81FF34] to-white absolute bottom-0" />
          </div>
        ) : paymentStatus === "failure" ? (
          <div className="flex flex-col items-center">
            <p className="text-center pb-2 font-medium text-base">
              Transaction Failed!
            </p>
            <p className="text-center pb-2 font-medium text-sm">
              Please retry payment again
            </p>
            <div className="">
              <Image
                src={paymentFailureGif}
                alt="Success"
                width={0}
                height={0}
                sizes="100%"
                className="h-48 w-48"
              />
            </div>
            <Link href={`/event/${event_id}/payment`}>
              <button className="font-semibold bg-rose-900 rounded-lg p-2 px-16 text-white w-max mx-auto">
                Back to payment screen
              </button>
            </Link>
            <div class="h-16" />
            <div class="-z-10 h-32 w-full bg-gradient-to-t from-[#FF8A00] to-white absolute bottom-0" />
          </div>
        ) : null}
      </div>
    </>
  );
}
