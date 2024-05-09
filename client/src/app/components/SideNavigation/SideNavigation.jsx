import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./sideNavigation.module.css";

function SideNavigation() {
  return (
    <div className={styles.container}>
      <div className="flex_column_center">
        <Link href="user/upload">
          <Image src="/upload.png" width={30} height={30} alt="upload"></Image>
        </Link>
        <Link href="user/message">
          <Image
            src="/message.png"
            width={30}
            height={30}
            alt="message"
          ></Image>
        </Link>
        <Link href="user/explore">
          <Image
            src="/explore.png"
            width={30}
            height={30}
            alt="explore"
          ></Image>
        </Link>
        <Link href="user/search">
          <Image src="/search.png" width={30} height={30} alt="search"></Image>
        </Link>
        <Link href="user/upcoming">
          <Image
            src="/upcoming.png"
            width={30}
            height={30}
            alt="upcoming"
          ></Image>
        </Link>
        <Link href="user/saved">
          <Image src="/bookmark.png" width={30} height={30} alt="saved"></Image>
        </Link>
        <Link href="user/profile">
          <Image
            src="/profile.png"
            width={30}
            height={30}
            alt="profile"
          ></Image>
        </Link>
      </div>
      <div className="flex_column_center">
        <Link href="user/emergency">
          <Image
            src="/emergency.png"
            width={30}
            height={30}
            alt="emergency"
          ></Image>
        </Link>
        <Link href="user/settings">
          <Image
            src="/settings.png"
            width={30}
            height={30}
            alt="settings"
          ></Image>
        </Link>
      </div>
    </div>
  );
}

export default SideNavigation;
