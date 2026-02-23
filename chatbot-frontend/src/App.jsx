import React from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'


const App = () => {
  return (
    <>
      <div className='flex h-screen w-screen'>
         <Sidebar />
         <Routes>
          <Route path='/' element={<ChatBox />} /> 
         </Routes>  
      </div>
    </>
  )
}

export default App
