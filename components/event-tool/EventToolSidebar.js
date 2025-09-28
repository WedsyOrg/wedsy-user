export default function EventToolSidebar({
  tempEventDay,
  displayKey,
  handlePlannerClick,
  categoryList,
}) {
  return (
    <>
      <div className="overflow-y-auto hide-scrollbar hidden border-r md:flex flex-col gap-6 py-4 pl-4">
        {tempEventDay?.decorItems.length > 0 && (
          <div className="flex flex-col gap-3 pl-3">
            <p className="flex flex-row justify-between pb-2 font-semibold text-xl">
              Decor
            </p>
            <div className="flex flex-col gap-2">
              {tempEventDay?.decorItems
                ?.filter(
                  (i) =>
                    categoryList?.find((r) => r.name === i.category)
                      ?.adminEventToolView === "single"
                )
                ?.sort(
                  (a, b) =>
                    [
                      "Nameboard",
                      "Entrance",
                      "Pathway",
                      "Photobooth",
                      "Stage",
                      "Mandap",
                    ].indexOf(a.category) -
                    [
                      "Nameboard",
                      "Entrance",
                      "Pathway",
                      "Photobooth",
                      "Stage",
                      "Mandap",
                    ].indexOf(b.category)
                )
                .map((item, index) =>
                  displayKey === `decor-${item.decor._id}` ? (
                    <div
                      className="font-medium text-lg flex flex-row gap-2 items-center pl-2"
                      key={index}
                    >
                      {item.category}
                      <span className="h-px flex-grow bg-black"></span>
                    </div>
                  ) : (
                    <div
                      className="text-gray-700 cursor-pointer"
                      key={index}
                      onClick={() =>
                        handlePlannerClick(`decor-${item.decor._id}`)
                      }
                    >
                      {item.category}
                    </div>
                  )
                )}
              {categoryList
                ?.filter((r) => r.adminEventToolView === "group")
                .filter(
                  (r) =>
                    tempEventDay?.decorItems?.filter(
                      (i) => i.category === r.name
                    ).length > 0
                )
                .map((item, index) =>
                  displayKey === `category-${item.name}` ? (
                    <div
                      className="font-medium text-lg flex flex-row gap-2 items-center pl-2"
                      key={index}
                    >
                      {item.name}
                      <span className="h-px flex-grow bg-black"></span>
                    </div>
                  ) : (
                    <div
                      className="text-gray-700 cursor-pointer"
                      key={index}
                      onClick={() =>
                        handlePlannerClick(`category-${item.name}`)
                      }
                    >
                      {item.name}
                    </div>
                  )
                )}
            </div>
          </div>
        )}
        {tempEventDay?.packages.length > 0 && (
          <div className="flex flex-col gap-3 pl-3">
            <p className="flex flex-row justify-between pb-2 font-semibold text-xl">
              Decor Packages
            </p>
            <div className="flex flex-col gap-2">
              {tempEventDay?.packages.map((item, index) =>
                displayKey === `package-${item.package._id}` ? (
                  <div
                    className="font-medium text-lg flex flex-row gap-2 items-center pl-2"
                    key={index}
                  >
                    {item.package.name}
                    <span className="h-px flex-grow bg-black"></span>
                  </div>
                ) : (
                  <div
                    className="text-gray-700 cursor-pointer"
                    key={index}
                    onClick={() =>
                      handlePlannerClick(`package-${item.package._id}`)
                    }
                  >
                    {item.package.name}
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {tempEventDay?.customItems?.length > 0 && (
          <div className="flex flex-col gap-3 pl-3 font-medium text-xl">
            {displayKey === `custom-add-ons` ? (
              <div className="font-semibold flex flex-row gap-2 items-center pl-2">
                {tempEventDay?.customItemsTitle || "ADD-ONS"}
                <span className="h-px flex-grow bg-black"></span>
              </div>
            ) : (
              <div
                className="text-gray-700 cursor-pointer"
                onClick={() => handlePlannerClick(`custom-add-ons`)}
              >
                {tempEventDay?.customItemsTitle || "ADD-ONS"}
              </div>
            )}
          </div>
        )}
        
        {/* Summary Section - Always show if there are any items */}
        {(tempEventDay?.decorItems?.length > 0 || 
          tempEventDay?.packages?.length > 0 || 
          tempEventDay?.customItems?.length > 0) && (
          <div className="flex flex-col gap-3 pl-3 font-medium text-xl">
            {displayKey === `event-summary` ? (
              <div className="font-semibold flex flex-row gap-2 items-center pl-2">
                Summary
                <span className="h-px flex-grow bg-black"></span>
              </div>
            ) : (
              <div
                className="text-gray-700 cursor-pointer"
                onClick={() => handlePlannerClick(`event-summary`)}
              >
                Summary
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
