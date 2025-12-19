import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  onFocus,
  disabled,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  rounded = "full", // "full" | "md"
  showIcon = true,
  autoFocus = false,
  name,
}) {
  const roundedClass = rounded === "md" ? "rounded-lg" : "rounded-full";

  return (
    <div className={`relative w-full ${className}`}>
      {showIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch size={16} />
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={`w-full py-2 px-4 text-gray-700 ${roundedClass} border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#840032] ${
          showIcon ? "pl-10" : ""
        } ${inputClassName}`}
        style={{ fontFamily: "Montserrat, sans-serif" }}
      />
    </div>
  );
}
