// File: components/product/ProductDescriptionSidebar.js

import { toProperCase } from "@/utils/text";

function ProductDescriptionSidebar({ decor, category }) {
  return (
    <aside className="hidden lg:flex flex-col gap-3 ">
      <h2 className="text-xl font-normal">DESCRIPTION</h2>
      
      <div className="rounded-2xl bg-white shadow-md flex flex-col gap-2 p-4 px-6 border">
        <p className="text-lg font-medium">Can be used for</p>
        <ul className="list-disc pl-8 flex flex-col text-sm font-normal">
          {decor.productVariation.occassion.map((item, index) => (
            <li key={index}>{toProperCase(item)}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white shadow-md flex flex-col gap-2 p-4 px-6 border">
        <p className="text-lg font-medium">Colour theme</p>
        <div className="flex flex-wrap gap-2">
            {/* This will need to be connected to actual data later */}
            <span className="bg-yellow-200 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Gold</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-md flex flex-col gap-2 p-4 px-6 border">
        <p className="text-lg font-medium">Backdrop size (ft)</p>
        <p className="text-sm font-normal flex flex-row justify-around">
          {decor.productInfo.measurements.length > 0 && (
            <span>L: {decor.productInfo.measurements.length} ft.</span>
          )}
          {decor.productInfo.measurements.width > 0 && (
            <span>W: {decor.productInfo.measurements.width} ft.</span>
          )}
          {decor.productInfo.measurements.height > 0 && (
            <span>H: {decor.productInfo.measurements.height} ft.</span>
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-md flex flex-col gap-2 p-4 px-6 border">
        <p className="text-lg font-medium">Includes</p>
        <ul className="list-disc pl-8 flex flex-col text-sm font-normal">
          {decor.productInfo.included.map((item, index) => (
            <li key={index}>{toProperCase(item)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default ProductDescriptionSidebar;