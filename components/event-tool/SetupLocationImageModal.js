import { Modal, Textarea } from "flowbite-react";
import Image from "next/image";

export default function SetupLocationImageModal({
  setupLocationImage,
  setSetupLocationImage,
}) {
  return (
    <>
      <Modal
        show={setupLocationImage?.open || false}
        size="lg"
        popup
        onClose={() =>
          setSetupLocationImage({
            open: false,
            image: "",
          })
        }
      >
        <Modal.Header />
        <Modal.Body>
          <div className="">
            <Image
              src={setupLocationImage?.image}
              alt="setup Location Image"
              sizes="100%"
              width={0}
              height={0}
              className="w-full h-auto object-contain"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
