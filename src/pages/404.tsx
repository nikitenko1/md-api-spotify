import Image from "next/image";

export default function Custom404() {
  return (
    <div className="flex h-screen justify-center bg-[#0D0C0F] text-white">
      <Image fill src={"/404.svg"} alt="404" />
    </div>
  );
}
