import { Btn } from "@/components/btn/Btn";
import clsx from "clsx";
import Link from "next/link";
import { CiDeliveryTruck } from "react-icons/ci";

export default function Home() {
  return (
    <main>
      <h1>david</h1>
      <div
        className={clsx(
          // defaulr 
          "flex flex-col",
          "gap-2",
          "text-center",
          "justify-center",
          "items-center"

          // darmode
        
        )}
      >
        <CiDeliveryTruck/>
        <Btn text="registro" />
        <Btn text="registro" />
        <Btn text="login" />
        <Btn text="registro" />

        <Link href="/registro">Registro</Link>
        <Link href="/login">login</Link>
      </div>
    </main>
  );
}
