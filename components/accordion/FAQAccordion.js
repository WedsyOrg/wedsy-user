import { useState } from "react";
import {
  BsCaretDownFill,
  BsCaretUpFill,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";

const FAQAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-4 my-4 py-4">
      <p
        className="font-medium items-center cursor-pointer"
        onClick={toggleAccordion}
      >
        <span>{question}</span>
        {isOpen ? (
          <BsCaretUpFill cursor={"pointer"} className="float-right mr-6" />
        ) : (
          <BsCaretDownFill cursor={"pointer"} className="float-right mr-6" />
        )}
      </p>
      {isOpen && <p className="font-light">{answer}</p>}
    </div>
  );
};

export default FAQAccordion;
