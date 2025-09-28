import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const InvoicePage = () => {
  const router = useRouter();
  const { paymentId } = router.query;
  const [loading, setLoading] = useState(true);
  const [pdfContent, setPdfContent] = useState(null);

  useEffect(() => {
    const fetchInvoicePdf = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/${paymentId}/invoice`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.ok) {
          const blob = await res.blob();
          setPdfContent(URL.createObjectURL(blob));
        } else {
          throw new Error("Invoice not found");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        router.push("/my-payments");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchInvoicePdf();
      console.log(router.pathname);
    }
  }, [paymentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pdfContent) {
    return null;
  }

  return (
    <div style={{ height: "100vh" }}>
      <iframe src={pdfContent} width="100%" height="100%" title="Invoice PDF" />
    </div>
  );
};

export default InvoicePage;
