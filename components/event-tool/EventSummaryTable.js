import { toPriceString } from "@/utils/text";
import { Table } from "flowbite-react";

export default function EventSummaryTable({ tempEventDay }) {
  // Define the order for categories
  const categoryOrder = ["Nameboard", "Entrance", "Pathway", "Stage", "Photobooth", "Furniture"];
  
  // Group decor items by category
  const groupedDecorItems = tempEventDay?.decorItems?.reduce((groups, item) => {
    const category = item.decor.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {}) || {};
  
  // Sort categories by predefined order and create sorted groups
  const sortedCategoryGroups = Object.keys(groupedDecorItems).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    
    // If category not found in order, put it at the end
    const aOrder = aIndex === -1 ? 999 : aIndex;
    const bOrder = bIndex === -1 ? 999 : bIndex;
    
    return aOrder - bOrder;
  }).map(category => ({
    category,
    items: groupedDecorItems[category]
  }));

  return (
    <>
      <div className="mt-8 mb-6" data-key="event-summary">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        EVENT SUMMARY
        </h3>
        <div className="overflow-x-auto md:w-4/5 mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <Table className="w-full">
              <Table.Head className="bg-gradient-to-r from-rose-50 to-rose-100">
                <Table.HeadCell className="px-4 py-3 text-left font-semibold text-gray-700">
                  #
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-3 text-left font-semibold text-gray-700">
                  Item
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-3 text-right font-semibold text-gray-700">
                  Price
              </Table.HeadCell>
            </Table.Head>
              <Table.Body className="divide-y divide-gray-100">
                {sortedCategoryGroups.map((group, groupIndex) => (
                  <Table.Row
                    className="hover:bg-gray-50 transition-colors duration-200"
                    key={group.category}
                  >
                    <Table.Cell className="px-4 py-3 text-gray-600 font-medium">
                      {groupIndex + 1}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-lg">
                          {group.category}
                        </span>
                        <div className="mt-1 space-y-1">
                          {group.items.map((item, itemIndex) => (
                            <span key={itemIndex} className="block text-sm text-gray-600">
                              {item.decor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                      {toPriceString(
                        group.items.reduce((total, item) => total + item.price, 0)
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              {tempEventDay?.packages.map((item, index) => (
                <Table.Row
                    className="hover:bg-gray-50 transition-colors duration-200"
                  key={index}
                >
                    <Table.Cell className="px-4 py-3 text-gray-600 font-medium">
                      {sortedCategoryGroups.length + index + 1}
                  </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {item.package.name}
                        </span>
                        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                          Package
                        </span>
                      </div>
                  </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                    {toPriceString(item.price)}
                  </Table.Cell>
                </Table.Row>
              ))}
              {tempEventDay.customItems.filter((i) => !i.includeInTotalSummary)
                .length > 0 && (
                  <Table.Row className="hover:bg-gray-50 transition-colors duration-200">
                    <Table.Cell className="px-4 py-3 text-gray-600 font-medium">
                      {sortedCategoryGroups.length + tempEventDay?.packages.length + 1}
                  </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                    {tempEventDay.customItemsTitle || "ADD ONS"}
                        </span>
                        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                          Add-ons
                        </span>
                      </div>
                  </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right font-semibold text-rose-900">
                    {toPriceString(
                      tempEventDay?.customItems
                        .filter((i) => !i.includeInTotalSummary)
                        .reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.price;
                        }, 0)
                    )}
                  </Table.Cell>
                </Table.Row>
              )}
              {tempEventDay?.mandatoryItems
                .filter((i) => i.itemRequired && !i.includeInTotalSummary)
                ?.map((item, index) => (
                  <Table.Row
                      className="hover:bg-gray-50 transition-colors duration-200"
                    key={index}
                  >
                      <Table.Cell className="px-4 py-3 text-gray-600 font-medium">
                        {sortedCategoryGroups.length +
                        tempEventDay?.packages.length +
                        (tempEventDay.customItems.filter(
                          (i) => !i.includeInTotalSummary
                        ).length
                          ? 1
                          : 0) +
                        index +
                        1}
                    </Table.Cell>
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
                      {toPriceString(item.price)}
                    </Table.Cell>
                  </Table.Row>
                ))}
                {/* Total Row */}
                <Table.Row className="bg-gradient-to-r from-rose-50 to-rose-100 border-t-2 border-rose-200">
                  <Table.Cell className="px-4 py-4" />
                  <Table.Cell className="px-4 py-4 text-right font-bold text-lg text-gray-800">
                  Total
                </Table.Cell>
                  <Table.Cell className="px-4 py-4 text-right font-bold text-xl text-rose-900">
                  {toPriceString(
                    tempEventDay?.decorItems.reduce(
                      (accumulator, currentValue) => {
                        return accumulator + currentValue.price;
                      },
                      0
                    ) +
                      tempEventDay?.packages.reduce(
                        (accumulator, currentValue) => {
                          return accumulator + currentValue.price;
                        },
                        0
                      ) +
                      tempEventDay?.customItems
                        .filter((i) => !i.includeInTotalSummary)
                        .reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.price;
                        }, 0) +
                      tempEventDay?.mandatoryItems
                        ?.filter(
                          (i) => i.itemRequired && !i.includeInTotalSummary
                        )
                        .reduce((accumulator, currentValue) => {
                          return accumulator + currentValue.price;
                        }, 0)
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
