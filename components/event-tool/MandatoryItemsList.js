import { toPriceString } from "@/utils/text";
import ImageCard from "../cards/ImageCard";

export default function MandatoryItemsList({ mandatoryItems }) {
  return (
    <>
      {mandatoryItems.length > 0 && (
        <>
          {/* <p
            className="text-xl font-semibold flex flex-row items-center gap-2 my-3"
            data-key={"custom-add-ons"}
          >
            Mandatory Items
          </p> */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-black border-b border-b-black pb-2 pt-2">
            {mandatoryItems?.map((item, index) => (
              <div
                className="grid grid-cols-4 gap-2 px-2 items-center"
                key={index}
              >
                <div className="py-2">
                  {item.image && (
                    <ImageCard src={item?.image} className="rounded-xl " />
                  )}
                </div>
                <div className="flex flex-col col-span-3 gap-4 py-2">
                  <p className="border border-black text-sm p-1 rounded-lg">
                    {item.description}
                  </p>
                  <p>
                    Price:{" "}
                    <span className="border border-black p-1 rounded-lg">
                      {toPriceString(item.price)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
