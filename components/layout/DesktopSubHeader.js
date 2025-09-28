import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/router";

export default function DesktopSubHeader({ title = "My Bids" }) {
  const router = useRouter();
  return (
    <div className="hidden md:flex items-center gap-4 px-24 py-4 bg-white border-b border-gray-200" style={{
      fontFamily: 'Montserrat, sans-serif',
    }}>
      <button
        className="flex items-center gap-2 text-[#2B3F6C] hover:opacity-80"
        onClick={() => router.back()}
      >
        <MdArrowBack size={22} />
      </button>
      <h1 className="text-2xl font-semibold text-black-400 uppercase" style={{
        fontFamily: 'Montserrat, sans-serif',
      }}>{title}</h1>
    </div>
  );
}
