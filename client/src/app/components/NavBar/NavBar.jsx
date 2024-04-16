import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './NavBar.module.css'
import ArbutusSlab from '../../../../public/fonts/Arbutus_Slab'

function NavBar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Image src='/roamioLogo.png' width={50} height={50} alt='roamio logo' />
        <div>
          <h1 className={ArbutusSlab.className}>Roamio</h1>
          <p className={ArbutusSlab.className}>Love the Journey, Live the Adventure.</p>
        </div>
      </div>
      <div className={styles.navigation}>
        <ul>
          <Link href='/'><li className={ArbutusSlab.className}>About us</li></Link>
          <Link href='/'><li className={ArbutusSlab.className}>Contact us</li></Link>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
