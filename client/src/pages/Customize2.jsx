import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { RiRobotLine, RiArrowRightLine, RiCheckboxCircleFill } from 'react-icons/ri'
import axios from 'axios'
import { FaArrowLeft } from "react-icons/fa";

const Customize2 = () => {
    const { userData, updateUserData, setUserData,
        selectedImage,
        setBackendImage,
        setFrontendImage,
        setSelectedImage,
        frontendImage,
        backendImage, serverUrl } = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    // FIXED: Add proper back navigation handler
    const handleGoBack = () => {
        navigate(-1) // Go back to previous page
    }

    const handleSubmit = async () => {
        if (!assistantName.trim()) return

        setIsLoading(true)

        try {
            let formdata = new FormData
            formdata.append("assistantName", assistantName)
            if (backendImage) {
                formdata.append("assistantImage", backendImage)
            } else {
                formdata.append("imageUrl", selectedImage)
            }
            const res = await axios.post(`${serverUrl}/api/user/update`, formdata, { withCredentials: true })
            console.log('res.data', res.data);
            setUserData(res.data)

            setIsLoading(false)
            navigate("/")
        } catch (error) {
            console.log('err', error);
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className='bg-gradient-to-t from-black to-blue-950'>
            {/* FIXED: Proper back button with event handler */}
            <div 
                onClick={handleGoBack} 
                className="cursor-pointer p-3 inline-block hover:bg-white/10 rounded-full transition-colors duration-200"
            >
                <FaArrowLeft className='text-white w-6 h-6' />
            </div>
            
            <div className='min-h-screen -mt-8 flex items-center justify-center py-12 px-4'>
                <div className="max-w-2xl w-full mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                            Name Your AI Assistant
                        </h1>
                        <p className="text-gray-300 text-lg max-w-md mx-auto">
                            Give your assistant a personality with a unique name
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="mb-10 relative">
                        <input
                            type="text"
                            placeholder='e.g., Jarvis, Athena, Neo'
                            className='w-full max-w-2xl h-16 outline-none border-2 border-white bg-blue-900/20 text-white placeholder:text-blue-200/60 px-6 py-2 rounded-full text-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300'
                            required
                            onChange={(e) => setAssistantName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            value={assistantName}
                            maxLength={20}
                        />
                        {assistantName && (
                            <div className="absolute right-4 top-[20px] ">
                                <RiCheckboxCircleFill className="text-blue-400 text-2xl" />
                            </div>
                        )}
                        <div className="text-right mt-2 text-blue-200/60 text-sm">
                            {assistantName.length}/20 characters
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="text-center">
                        <button
                            className={`flex items-center justify-center mx-auto px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${assistantName.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                            onClick={handleSubmit}
                            disabled={!assistantName.trim() || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                    Creating Your Assistant...
                                </>
                            ) : (
                                <>
                                    Finally Create Your Assistant
                                    <RiArrowRightLine className="ml-2 text-xl" />
                                </>
                            )}
                        </button>

                        {!assistantName.trim() && (
                            <p className="text-red-300 mt-4 animate-pulse">
                                Please enter a name for your assistant
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customize2