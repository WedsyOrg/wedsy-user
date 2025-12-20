import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const InvoicePage = () => {
  const router = useRouter();
  const { paymentId } = router.query;
  const [loading, setLoading] = useState(true);
  const [pdfContent, setPdfContent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoicePdf = async () => {
      try {
        setError("");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const res = await fetch(
          `${apiUrl}/payment/${paymentId}/invoice`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPdfContent(url);
        } else {
          throw new Error("Invoice not found");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error?.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchInvoicePdf();
      console.log(router.pathname);
    }
    return () => {
      if (pdfContent) URL.revokeObjectURL(pdfContent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-lg font-semibold text-gray-900">Unable to open invoice</p>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          className="px-5 py-2 rounded-full bg-black text-white"
          onClick={() => router.push("/my-payments")}
        >
          Back to Payments
        </button>
      </div>
    );
  }

  if (!pdfContent) return null;

  return (
    <div className="h-screen w-full">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-white">
        <div className="text-sm text-gray-700">
          Invoice: <span className="font-semibold">{paymentId}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={pdfContent}
            download={`invoice-${paymentId}.pdf`}
            className="px-4 py-2 rounded-full bg-[#840032] text-white text-sm"
          >
            Download PDF
          </a>
          <a
            href={pdfContent}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-gray-300 text-sm"
          >
            Open
          </a>
        </div>
      </div>
      <iframe src={pdfContent} width="100%" height="100%" title="Invoice PDF" />
    </div>
  );
};

export default InvoicePage;
