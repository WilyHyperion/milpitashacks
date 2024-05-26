import Image from "next/image";
export default function Header() {
  return (
    <>
      <div className=" z-50 border-b border-black left-0 top-0 p-0 w-[100vw] items-center h-[9vh] bg-[#77a6b6] flex justify-between absolute flex-row">
        <div>
        <Image
          src={require("/public/logo.svg")}
          alt="logo"
          width={40}
          className="m-4"
        />

        </div>
        <div className=" cursor-pointer font-antic text-white text-xl flex flex-row gap-10">
          <div className={"border-black border h-[9vh] text-center border-y-0 flex items-center justify-center  px-6 hover:bg-[#6da0b1]"} onClick={
            () => {
              window.location.href = "/";
            }
          }  > <div>HOME</div></div>
          <div className="border-black border h-[9vh] text-center border-y-0 flex items-center justify-center px-6 hover:bg-[#6da0b1]" onClick={
            () => {
              window.location.href = "/testgen";
            }
          }> <div>CREATE TEST</div></div>
          <div className="border-black border h-[9vh] text-center border-y-0 flex items-center justify-center  px-6 hover:bg-[#6da0b1]" onClick={() => {
              window.location.href = "/studyguide";
            } }> <div>CREATE STUDY GUIDE </div></div>
        </div>

        <div></div>
      </div>
    </>
  );
}
