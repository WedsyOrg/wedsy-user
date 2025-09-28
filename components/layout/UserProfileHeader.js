import { Select } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserProfileHeader({ display }) {
  const router = useRouter();
  return (
    <>
      <div className="hidden md:flex flex-row gap-8 items-center py-6 px-24 mx-auto w-full">
        <Link
          href="/my-account"
          className={`rounded-full py-2 px-6 uppercase shadow-xl ${
            display === "my-account"
              ? "bg-rose-900 text-white font-semibold"
              : "bg-white text-black font-mmedium"
          }`}
        >
          Account
        </Link>
        <Link
          href="/my-orders"
          className={`rounded-full py-2 px-6 uppercase shadow-xl ${
            display === "my-orders"
              ? "bg-rose-900 text-white font-semibold"
              : "bg-white text-black font-mmedium"
          }`}
        >
          Orders
        </Link>
        <Link
          href="/my-payments"
          className={`rounded-full py-2 px-6 uppercase shadow-xl ${
            display === "my-payments"
              ? "bg-rose-900 text-white font-semibold"
              : "bg-white text-black font-mmedium"
          }`}
        >
          Payments
        </Link>
      </div>
      <div className="px-8 md:hidden py-6">
        <Select
          onChange={(e) => {
            router.push(e.target.value);
          }}
          value={router.pathname}
          className="mx-auto"
        >
          <option value={"/my-account"}>Account</option>
          <option value={"/my-orders"}>Orders</option>
          <option value={"/my-payments"}>Payments</option>
        </Select>
      </div>
    </>
  );
}
