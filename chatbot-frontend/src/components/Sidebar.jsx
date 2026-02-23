import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Sidebar = () => {
    
    const {chats, setSelectedChat, user} = useAppContext()
    const[search, setSearch] = useState('')

  return (
    <div className='flex flex-col h-screen min-w-72 p-5 border-r border-gray-300 backdrop-blur-3xl
    transition-all duration-500 max-md:absolute left-0 z-1' >
      {/*logo */}
      <img src={assets.logo_full} alt=""
      className='w-full max-w-48' />
    </div>
  )
}

export default Sidebar
