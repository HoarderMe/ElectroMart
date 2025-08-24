import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import AdminSidebar from '../components/Admin/AdminSidebar'
// import { useSelector } from 'react-redux'


const Admin = () => {
  // const user = useSelector(state => state.user.user)
  // console.log(user);


  
  // const navigate = useNavigate();
  // const data = localStorage.getItem('email')
  // if(data === null){
  //   navigate('/login');
  // }
  // if(data !== 'deva@gmail.com'){
  //   return <h1>Access Denied</h1>
  // }
  return (
    <>
  <Header />
      <div className='flex overflow-y-none mx-auto border-r-2 border-neutral-200 '>
        <AdminSidebar />
        <div className='pt-5 flex-grow bg-[#f0f0ec] '>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Admin