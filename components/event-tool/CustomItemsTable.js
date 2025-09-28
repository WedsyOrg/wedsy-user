import { toPriceString } from "@/utils/text";
import { Table } from "flowbite-react";
import ImageCard from "../cards/ImageCard";
import { MdOutlineImage } from "react-icons/md";

export default function CustomItemsTable({
  customItems,
  customItemsTitle,
  setSetupLocationImage,
  setupLocationImage,
}) {
  return (
    <>
      {customItems.length > 0 && (
        <>
          <p
            className="text-xl font-semibold flex flex-row items-center gap-2 my-3"
            data-key={"custom-add-ons"}
          >
            {customItemsTitle || "ADD ONS"}
          </p>
          <div className="md:mr-3">
            <div className="overflow-x-auto">
              <Table className="border mb-3 w-full text-sm md:text-md">
                <Table.Head>
                  <Table.HeadCell className="p-1">
                    <span className="sr-only">#</span>
                  </Table.HeadCell>
                  <Table.HeadCell>Item Name</Table.HeadCell>
                  <Table.HeadCell className="p-1">Qty.</Table.HeadCell>
                  <Table.HeadCell className="text-right p-1">
                    Price
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {customItems?.map((item, index) => (
                    <Table.Row
                      className="text-xs bg-white dark:border-gray-700 dark:bg-gray-800 divide-x"
                      key={index}
                    >
                      <Table.Cell className="p-1 text-center">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-white flex flex-col md:flex-row justify-between">
                        <p className="mr-auto">{item.name}</p>
                        {item.setupLocationImage && (
                          <MdOutlineImage
                            cursor={"pointer"}
                            className={`text-gray-600 font-bold text-xl mr-2 `}
                            onClick={() => {
                              setSetupLocationImage({
                                ...setupLocationImage,
                                image: item.setupLocationImage,
                                open: true,
                              });
                            }}
                          />
                        )}
                        {item.image && (
                          <ImageCard
                            src={item?.image}
                            className="rounded-lg w-24 h-24 overflow-hidden"
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell className="p-1 text-center">
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell className="text-right text-rose-900 font-medium p-1">
                        {toPriceString(item.price)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div className="flex flex-row border-b border-b-black">
            <div className="flex flex-col w-full md:w-1/3 md:ml-auto">
              <div className="mt-auto flex flex-row items-center justify-between gap-2 text-lg text-white font-medium bg-gradient-to-l from-rose-900 to-white py-2 px-10">
                <span className="uppercase text-black font-medium">Total</span>
                <span className="font-medium">
                  {toPriceString(
                    customItems?.reduce((accumulator, currentValue) => {
                      return accumulator + currentValue.price;
                    }, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
