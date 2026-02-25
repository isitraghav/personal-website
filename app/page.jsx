import Image from "next/image";
import Glaze from "../components/Glaze"
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Glaze />

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hi</h1>
      </div>
    </div>
  );
}
