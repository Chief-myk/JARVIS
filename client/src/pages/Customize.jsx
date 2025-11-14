import React, { useContext, useRef, useState } from 'react'
import { RiImageAddLine, RiArrowRightLine, RiCheckboxCircleFill } from 'react-icons/ri'
import { userDataContext } from '../context/UserContext'
import { FaArrowLeft } from "react-icons/fa";
// Import your images (these paths should be correct based on your project structure)
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.jpeg"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import { useNavigate } from 'react-router-dom'

const Customize = () => {
    const {
        selectedImage,
        setBackendImage,
        setFrontendImage,
        setSelectedImage,
        frontendImage,
        backendImage
    } = useContext(userDataContext)

    const inputimage = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const nav = useNavigate()

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
            setSelectedImage(null) // Deselect any preset image when uploading custom
        }
    }

    const handleImageClick = (image) => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
    }

    const handleNext = () => {
        setIsLoading(true)
        // Simulate loading for better UX
        setTimeout(() => {
            nav("/customize2")
            setIsLoading(false)

        }, 1000)
    }

    const Card = ({ image }) => {
        const isSelected = selectedImage === image
        return (
            <div
                className={`relative w-72 h-80 bg-gray-800 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105
          ${isSelected
                        ? 'border-blue-500 shadow-xl shadow-blue-500/30 scale-105'
                        : 'border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/20'}`}
                onClick={() => handleImageClick(image)}
            >
                <img
                    src={image}
                    className='h-full w-full object-cover'
                    alt="Assistant option"
                />
                {isSelected && (
                    <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1.5">
                        <RiCheckboxCircleFill className="text-white text-xl" />
                    </div>
                )}
            </div>
        )
    }

       const handleGoBack = () => {
        nav("/signin") // Go back to previous page
    }


    const UploadCard = () => (
        <div
            className={`relative w-72 h-80 bg-gray-800 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center
        ${frontendImage
                    ? 'border-blue-500 shadow-xl shadow-blue-500/30 scale-105'
                    : 'border-dashed border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/20'}`}
            onClick={() => inputimage.current.click()}
        >
            {frontendImage ? (
                <>
                    <img
                        src={frontendImage}
                        className='h-full w-full object-cover'
                        alt="Uploaded assistant"
                    />
                    <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1.5">
                        <RiCheckboxCircleFill className="text-white text-xl" />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-6 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                    <RiImageAddLine className="text-5xl mb-3" />
                    <p className="text-center text-sm font-medium">Upload Custom</p>
                    <p className="text-center text-xs mt-1 opacity-75">Click to browse</p>
                </div>
            )}
            <input
                type="file"
                accept='image/*'
                hidden
                ref={inputimage}
                onChange={handleImage}
            />
        </div>
    )

    return (<div className='bg-gradient-to-t from-black to-blue-950'>
        {/* <div
            onClick={handleGoBack}
            className="cursor-pointer p-3 inline-block hover:bg-white/10 rounded-full transition-colors duration-200"
        >
            <FaArrowLeft className='text-white w-6 h-6' />
        </div> */}
        <div className='min-h-screen'>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center pt-6 mb-16">
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                        Choose Your Assistant Look
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose from our curated collection or upload your own image to personalize your AI assistant's appearance
                    </p>
                </div>

                {/* Selection Section */}
                <div className="mb-16">

                    {/* Preset Images Grid */}
                    <div className="mb-12">
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
                            <Card image={image1} />
                            <Card image={image2} />
                            <Card image={image3} />
                            <Card image={image4} />
                            <Card image={image5} />
                            <Card image={image6} />
                            <div>
                                <div className="flex justify-center">
                                    <UploadCard />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Action Section */}
                <div className="flex justify-center">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                        <div className="flex flex-col items-center space-y-4">
                            {(selectedImage || frontendImage) && (
                                <div className="text-center mb-2">
                                    <p className="text-green-400 font-medium text-sm">
                                        ✓ Assistant image selected
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={!selectedImage && !frontendImage}
                                className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
                  ${(selectedImage || frontendImage)
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        Continue <RiArrowRightLine className="ml-3 text-xl" />
                                    </>
                                )}
                            </button>

                            {!selectedImage && !frontendImage && (
                                <p className="text-gray-500 text-sm text-center max-w-xs">
                                    Please select or upload an image to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    )
}

export default Customize