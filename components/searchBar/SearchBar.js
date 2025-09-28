import { LiaSearchSolid } from "react-icons/lia";
export default function SearchBar({ value, onChange, disabled }) {
  return (
    <div className="flex flex-row border border-black rounded-lg items-center w-full overflow-hidden">
      <input
        type="text"
        className="grow border-0 rounded-lg"
        placeholder="I am Looking for..."
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="bg-rose-900 h-auto rounded-lg px-3 self-stretch items-center justify-center flex">
        <LiaSearchSolid color={"white"} className="" size={24} />
      </div>
    </div>
  );
}
