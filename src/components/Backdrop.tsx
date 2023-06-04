import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Backdrop = ({ children }: IProps) => {
  return (
    <div className="top-0 bottom-0 right-0 left-0 z-[999] grid place-items-center absolute bg-[#00000091]">
      {children}
    </div>
  );
};

export default Backdrop;
