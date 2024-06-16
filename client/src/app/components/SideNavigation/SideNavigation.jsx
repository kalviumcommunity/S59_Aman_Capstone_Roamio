import React from "react";
import Link from "next/link";
import Image from "next/image";

function SideNavigation() {
  return (
    <div className="bg-white border-r-4 pt-8 h-full flex flex-col justify-between z-0 bottom-0 border-green-800 fixed left-0 p-4">
      <div className="flex flex-col h-4/5 items-center justify-evenly pt-16">
        <Link href="/dashboard/upload">
          <Image src="/upload.png" width={30} height={30} alt="upload" />
        </Link>
        <Link href="/dashboard/message">
          <Image src="/message.png" width={30} height={30} alt="message" />
        </Link>
        <Link href="/dashboard/explore">
          <Image src="/explore.png" width={30} height={30} alt="explore" />
        </Link>
        <Link href="/dashboard/search">
          <Image src="/search.png" width={30} height={30} alt="search" />
        </Link>
        <Link href="/dashboard/upcoming">
          <Image src="/upcoming.png" width={30} height={30} alt="upcoming" />
        </Link>
        <Link href="/dashboard/saved">
          <Image src="/bookmark.png" width={30} height={30} alt="saved" />
        </Link>
        <Link href="/dashboard/profile">
          <Image src="/profile.png" width={30} height={30} alt="profile" />
        </Link>
      </div>
      <div className="flex flex-col  items-center justify-evenly h-[15%]">
        <Link href="/dashboard/emergency">
          <Image src="/emergency.png" width={30} height={30} alt="emergency" />
        </Link>
        <Link href="/dashboard/settings">
          <Image src="/settings.png" width={30} height={30} alt="settings" />
        </Link>
      </div>
    </div>
  );
}

export default SideNavigation;
