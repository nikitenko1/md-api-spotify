import React, { useEffect } from "react";
import { useSearch } from "../lib/zustand";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { IoMdSearch } from "react-icons/io";

interface IProps {
  search: string;
  setSearch: (term: string) => void;
}

const Search = () => {
  const [search, setSearch] = useSearch((state: any) => [state.search, state.setSearch], shallow);

  const router = useRouter();
  useEffect(() => {
    if (router.pathname.includes("/search")) {
      return;
    } else {
      setSearch("");
    }
  }, [router.pathname]);

  return (
    <div className="bg-black pt-4">
      <div
        className="max-w-4xl relative z-50 ml-16 lg:ml-24 xl:ml-32 flex bg-[#2e2e2e] rounded-lg 
      overflow-hidden space-x-2 items-center p-2"
      >
        <IoMdSearch className="text-white text-3xl animate-pulse" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none z-[999] text-white border-none w-full"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default Search;
