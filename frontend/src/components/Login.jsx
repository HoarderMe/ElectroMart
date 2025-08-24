import React, { useEffect, useState } from 'react'
import SignInForm from '../components/SignInForm'
// import { useSelector } from 'react-redux'
import Header from '../components/Header'
// import Footer from '../components/Footer'

const Login = () => {
  const [accessToken, setAccessToken] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  // const [user,setUser] = useState([]);
//   const userdata = useSelector(state => state.user.user)
//   console.log(userdata);
  useEffect(() => {
    const  accessToken = localStorage.getItem('accessToken')
    const  name = localStorage.getItem('username')
    const  role  = localStorage.getItem('role')
    setAccessToken(accessToken)
    setName(name)
    setRole(role)
    // console.log(user);
  }, [])

  
  return (
    <>
    <div>
      <Header/>
    <div className='flex flex-col gap-4 justify-center items-center bg-gradient-to-r from-blue-800 to-indigo-900  h-dvh '>
      <div className=' bg-white overflow-y-hidden rounded-lg w-[400px] h-auto'>
      <SignInForm />
      </div>
    </div>
    </div>
    </>
  )
}

export default Login