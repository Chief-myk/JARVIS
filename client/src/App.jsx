import React, { useContext, useState, useEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AboutDevelopers from './pages/AboutDevelopers'
import AboutProject from "./pages/AboutProject"
import Home from './pages/Home'
import NotFound from "./components/NotFound";
import { userDataContext } from './context/UserContext'
import Customize from "./pages/Customize"
import Loader from './components/Loader';
import Customize2 from './pages/Customize2'
import Image from './pages/Image'

const App = () => {
  const { userData } = useContext(userDataContext)
  const [loading, setLoading] = useState(true)

  // Use setTimeout to simulate loading on every render
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // Adjust timeout duration as needed

    return () => clearTimeout(timer)
  }, []) // Empty dependency array means this runs only once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader />
      </div>
    )
  }

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>}/>
        <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>}/>
        <Route path='/' element={(userData?.assistantImage && userData?.assistantName) ? <Home/> : <Navigate to={"/customize"} />}/>
        <Route path='/aboutProject' element={(userData?.assistantImage && userData?.assistantName) ? <AboutProject/> : <Navigate to={"/customize"} />}/>
        <Route path='/aboutDevelopers' element={(userData?.assistantImage && userData?.assistantName) ? <AboutDevelopers/> : <Navigate to={"/customize"} />}/>
        <Route path='/customize' element={userData ? <Customize/> : <Navigate to={"/signin"} />}/>
        <Route path='/customize2' element={userData ? <Customize2/> : <Navigate to={"/signin"} />}/>
        <Route path='/imageGenAndProcess' element={<Image />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App