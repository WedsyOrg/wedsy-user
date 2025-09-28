import { uploadFile } from "@/utils/file";
import { Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

export default function DecorQuotation({ userLoggedIn, user }) {
  const [formData, setFormData] = useState({
    image: "",
    location: "",
    comment: "",
    loading: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef();
  const handleSubmit = async () => {
    if (!formData.location || !formData.comment) {
      alert("Please fill out all fields");
    } else if (!imageFile) {
      alert("Please select the image");
    } else {
      setFormData({ ...formData, loading: true });
      const image = await uploadFile({
        file: imageFile,
        path: "quotations/images",
        id: Date.now() + user.phone.replace("+", "-"),
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          image,
          source: "Decor Landing Page",
        }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Quoation Submitted Successfully");
            setFormData({
              image: "",
              location: "",
              comment: "",
              loading: false,
            });
            setImageFile(null);
            imageRef.current.value = "";
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  return userLoggedIn ? (
    <div className="py-16 px-6 md:px-16 md:mx-24 bg-rose-900 md:rounded-3xl text-white">
      <p className="text-2xl md:text-3xl font-medium mb-8">
        Have a decor in mind? Get an instant quote!
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <p className="text-lg">
            {
              "Have a decor picture with you but you still don’t know how much it’s gonna cost? Upload your decor picture and Wedsy will revert back to you in 24 hours with a quote"
            }
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-8 justify-center">
            <input
              type="text"
              placeholder="CITY"
              name="city"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
              }}
              disabled={formData.loading}
              className="flex-grow pb-0 text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-gray-500 placeholder:font-medium"
            />
            <input
              type="text"
              placeholder="ADDITIONAL COMMENT"
              name="comment"
              value={formData.comment}
              onChange={(e) => {
                setFormData({ ...formData, comment: e.target.value });
              }}
              disabled={formData.loading}
              className="flex-grow pb-0 text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-gray-500 placeholder:font-medium"
            />
          </div>
        </div>
        <label
          for="fileInput"
          className="cursor-pointer bg-[#57575799] md:mx-4 rounded-xl flex flex-col items-center justify-center gap-4 p-6 mt-4 md:mt-0 w-full"
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            ref={imageRef}
            onChange={(e) => {
              setImageFile(e.target.files[0]);
            }}
            disabled={formData.loading}
          />
          <div className="bg-black p-2 rounded-full ">
            <AiOutlinePlus size={24} color="white" />
          </div>
          <span id="fileName" className="text-sm">
            {imageFile?.name || "UPLOAD HERE"}
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="rounded-full bg-white disabled:bg-white/50 text-black py-2 px-8 my-2 mx-auto block mt-4"
        disabled={
          !formData.location ||
          !formData.comment ||
          formData.loading ||
          !imageFile
        }
        onClick={handleSubmit}
      >
        {formData.loading ? (
          <>
            <Spinner size="sm" />
            <span className="pl-3">Loading...</span>
          </>
        ) : (
          <>Submit</>
        )}
      </button>
    </div>
  ) : (
    <></>
  );
}
