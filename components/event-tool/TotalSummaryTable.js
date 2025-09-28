import { toPriceString } from "@/utils/text";
import { Table } from "flowbite-react";

export default function TotalSummaryTable({ event }) {
  return (
    <>
      <div className="mt-8 mb-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          TOTAL SUMMARY
        </h3>
        <div className="overflow-x-auto md:w-4/5 mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <Table className="w-full">
              <Table.Head className="bg-gradient-to-r from-rose-50 to-rose-100">
                <Table.HeadCell className="px-4 py-3 text-left font-semibold text-gray-700">
                  #
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-3 text-left font-semibold text-gray-700">
                  Event Day
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-3 text-right font-semibold text-gray-700">
                  Price
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-100">
                {event?.eventDays?.map((item, index) => (
                  <Table.Row
                    className="hover:bg-gray-50 transition-colors duration-200"
                    key={index}
                  >
                    <Table.Cell className="px-4 py-3 text-gray-600 font-medium">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          Event Day
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                      {toPriceString(
                        item?.decorItems.reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.price;
                        }, 0) +
                          item?.packages.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.price;
                          }, 0) +
                          item?.customItems
                            .filter((i) => !i.includeInTotalSummary)
                            .reduce((accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            }, 0) +
                          item?.mandatoryItems
                            ?.filter(
                              (i) => i.itemRequired && !i.includeInTotalSummary
                            )
                            .reduce((accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            }, 0) +
                          0
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
                {event.eventDays?.map((tempEventDay, index) => (
                  <>
                    {tempEventDay.customItems
                      .filter((i) => i.includeInTotalSummary)
                      ?.map((item, index) => (
                        <Table.Row
                          className="hover:bg-gray-50 transition-colors duration-200"
                          key={index}
                        >
                          <Table.Cell className="px-4 py-3" />
                          <Table.Cell className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {item.name}
                              </span>
                              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                Add-ons
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                            ₹{item.price}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    {tempEventDay?.mandatoryItems
                      .filter((i) => i.itemRequired && i.includeInTotalSummary)
                      ?.map((item, index) => (
                        <Table.Row
                          className="hover:bg-gray-50 transition-colors duration-200"
                          key={index}
                        >
                          <Table.Cell className="px-4 py-3" />
                          <Table.Cell className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {item.description}
                              </span>
                              <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit">
                                Mandatory
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                            ₹{item.price}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </>
                ))}
                {/* Grand Total Row */}
                <Table.Row className="bg-gradient-to-r from-rose-50 to-rose-100 border-t-2 border-rose-200">
                  <Table.Cell className="px-4 py-4" />
                  <Table.Cell className="px-4 py-4 text-right font-bold text-lg text-gray-800">
                    Grand Total
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4 text-right font-bold text-xl text-rose-900">
                    {toPriceString(
                      event?.eventDays?.reduce(
                        (masterAccumulator, masterCurrentValue) => {
                          return (
                            masterAccumulator +
                            masterCurrentValue.decorItems.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            ) +
                            masterCurrentValue?.packages.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            ) +
                            masterCurrentValue?.customItems.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            ) +
                            masterCurrentValue?.mandatoryItems.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            )
                          );
                        },
                        0
                      )
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
