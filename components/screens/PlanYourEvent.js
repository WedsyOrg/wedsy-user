import Image from "next/image";
import Link from "next/link";
import styles from "./PlanYourEvent.module.css";

export default function PlanYourEvent() {
  return (
    <>
      <div className="mb-12">
        <div
          className={`${styles.bg_div_top} flex pb-4 md:pb-4 flex-col justify-end px-6 md:px-24 text-center md:text-left`}
        >
          <p className="font-medium text-base md:text-xl text-white uppercase">
            Explore the ease of planning
          </p>
          <p className="font-semibold text-base md:text-3xl text-white uppercase">
            PLAN YOUR EVENT NOW WITH OUR NEW
          </p>
        </div>
        <div
          className={`${styles.bg_div_bottom} lex pt-4 md:pt-4 flex-col justify-start px-6 md:px-24 text-center md:text-left`}
        >
          <p className="font-semibold md:font-semibold text-5xl md:text-6xl text-[#A00000] tracking-[0.2em]">
            EVENT TOOL!
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="font-medium text-base md:text-xl text-[#A00000] md:w-1/2">
              Utilize the tool to shortlist and choose your decorations
              effortlessly - all in one place, at Wedsy.
            </p>
            <Link
              href={`/event`}
              className="bg-[#A00000] rounded-xl p-2 px-16 text-white w-max"
            >
              Try Now!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
