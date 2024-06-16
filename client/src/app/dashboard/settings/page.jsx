"use client"

import React from 'react'

const handleLogout = () => {
  document.cookie = `accessToken=`;
  document.cookie = `refreshToken=`;
  alert("User logged out");
}

function Page() {
  return (
    <div className='fixed top-96'>
    <button onClick={handleLogout} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700">Log out</button>
    </div>
  )
}

export default Page
