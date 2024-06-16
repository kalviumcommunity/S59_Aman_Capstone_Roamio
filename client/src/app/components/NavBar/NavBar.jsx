import React from "react";
import Image from "next/image";
import Link from "next/link";
import ArbutusSlab from "../../../../public/fonts/Arbutus_Slab";

function NavBar() {
  return (
    <div className="w-screen z-10 flex justify-between p-2.5 border-b-4 border-green-800 bg-white fixed">
      <div className="flex justify-evenly items-center">
        <Image src="/roamioLogo.png" width={50} height={50} alt="roamio logo" />
        <div>
          <h1 className={`${ArbutusSlab.className} text-2xl relative top-1`}>
            Roamio
          </h1>
          <p
            className={`${ArbutusSlab.className} text-base relative bottom-1.25 tracking-tight`}
          >
            Love the Journey, Live the Adventure.
          </p>
        </div>
      </div>
      <div className="flex justify-evenly w-auto">
        <ul className="flex justify-evenly list-none">
          <Link href="/">
            <li
              className={`${ArbutusSlab.className} p-2.5 m-1.25 w-28 text-black text-lg cursor-pointer hover:bg-green-200 hover:rounded hover:shadow-md`}
            >
              About us
            </li>
          </Link>
          <Link href="/">
            <li
              className={`${ArbutusSlab.className} p-2.5 m-1.25 w-32 text-black text-lg cursor-pointer hover:bg-green-200 hover:rounded hover:shadow-md`}
            >
              Contact us
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
