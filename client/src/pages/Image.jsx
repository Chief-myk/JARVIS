import React, { useContext, useState } from 'react';
import { RiImageAiLine, RiImageAddLine } from "react-icons/ri";
import { MdChatBubbleOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaArrowUp, FaTimes } from "react-icons/fa";
import { dataContext } from '../context/UserContext2';
import Chat from '../components/Chat';
import { generateResponse } from "../api/gemini"; 
import { query, modifyImageAlternative } from '../api/huggingFace';

function Home() {
  const {
    startRes, setStartRes,
    popUp, setPopUp,
    input, setInput,
    feature, setFeature,
    showResult, setShowResult,
    prevFeature, setPrevFeature,
    genImgUrl, setGenImgUrl,
    user, setUser,
    prevUser, setPrevUser,
  } = useContext(dataContext);

  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // ✅ Chat handler
  async function handleSubmit(e) {
    e.preventDefault();   
    if (!input.trim()) return;   

    setPrevFeature(feature);
    setFeature("chat");
    setStartRes(true);
    setShowResult("");

    const updatedPrevUser = {
      data: user.data,
      mime_type: user.mime_type,
      imgUrl: user.imgUrl,
      prompt: input
    };
    
    // Clear user data after copying
    if (feature !== "modImg") {
      setUser({ data: null, mime_type: null, imgUrl: null });
    }
    
    setPrevUser(updatedPrevUser);
    setInput("");

    let result = await generateResponse(updatedPrevUser);
    setShowResult(result);
  }

  // ✅ Image upload handler
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB');
      return;
    }

    e.target.value = '';

    let reader = new FileReader();
    reader.onload = (event) => {
      let base64 = event.target.result.split(",")[1];
      const newUser = {
        data: base64,
        mime_type: file.type,
        imgUrl: `data:${file.type};base64,${base64}`
      };
      
      setUser(newUser);
      setFeature(feature === "modImg" ? "modImg" : "upimg");
    };
    reader.readAsDataURL(file);
  }

  // ✅ Image generation handler
// ✅ Image generation handler - Updated version
async function handleGenerateImg() {
  if (!input.trim()) return;
  
  setLoading(true);
  setStartRes(true);
  setPrevFeature("genimg");
  setFeature("chat");
  setGenImgUrl("");
  setProcessingStep('Generating image...');

  setPrevUser({ ...prevUser, prompt: input });

  try {
    let result = await query(input);
    
    if (result && result.size > 0) {
      let url = URL.createObjectURL(result);
      setGenImgUrl(url);
      setShowResult(""); // Clear any previous error messages
    } else {
      throw new Error("Received empty image data");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    setShowResult("Image generation failed. Please try again with a different prompt.");
    
    // Optionally, you can set a placeholder image or error message
    setGenImgUrl(null);
  } finally {
    setLoading(false);
    setProcessingStep('');
  }

  setInput("");
}
  // ✅ Image modification handler
  async function handleModifyingImg() {
    if (!input.trim()) {
      alert("Please enter a modification prompt!");
      return;
    }
    
    if (!user.imgUrl) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    setStartRes(true);
    setPrevFeature("modImg");
    setFeature("chat");
    setGenImgUrl("");
    setProcessingStep('Modifying image...');

    setPrevUser({ 
      ...prevUser, 
      imgUrl: user.imgUrl,
      prompt: input
    });

    try {
      let result = await modifyImageAlternative(user.imgUrl, input);
      let url = URL.createObjectURL(result);
      setGenImgUrl(url);
    } catch (error) {
      console.error("Error modifying image:", error);
      setShowResult("Image modification failed. Please try again.");
    } finally {
      setLoading(false);
    }

    setInput("");
    setUser({ data: null, mime_type: null, imgUrl: null });
  }

  // ✅ Clear uploaded image
  const clearUploadedImage = () => {
    setUser({ data: null, mime_type: null, imgUrl: null });
  };

  // ✅ Handle feature selection
  const handleFeatureSelect = (featureId) => {
    setPopUp(false);
    setFeature(featureId);
    
    if (featureId === "modImg" || featureId === "upimg") {
      if (!user.imgUrl) {
        document.getElementById("inputImg").click();
      }
    }
  };

  // ✅ Handle form submission based on feature
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (feature === "genimg") {
      handleGenerateImg();
    } else if (feature === "modImg") {
      handleModifyingImg();
    } else {
      handleSubmit(e);
    }
  };

  // Simplified feature buttons
  const featureButtons = [
    { id: "upimg", icon: RiImageAddLine, label: "Upload Image", color: "text-green-400" },
    { id: "genimg", icon: RiImageAiLine, label: "Generate Image", color: "text-cyan-400" },
    { id: "modImg", icon: RiImageAiLine, label: "Modify Image", color: "text-orange-400" },
    { id: "chat", icon: MdChatBubbleOutline, label: "Let's Chat", color: "text-yellow-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="w-full h-20 flex items-center justify-start px-6 lg:px-8">
        <div 
          className="text-2xl lg:text-3xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          onClick={() => {
            setStartRes(false);
            setFeature("chat");
            setUser({ data: null, mime_type: null, imgUrl: null });
            setPopUp(false);
            setGenImgUrl("");
            setProcessingStep('');
          }}
        >
          Smart AI Bot
        </div>
      </nav>

      {/* Hidden file input */}
      <input type="file" accept='image/*' hidden id='inputImg' onChange={handleImage} />

      {/* Main Content */}
      <main className="w-full h-[calc(100vh-80px)] flex flex-col">
        {!startRes ? (
          // Hero Section
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
              What can I help with?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl w-full">
              {featureButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => handleFeatureSelect(button.id)}
                  className={`
                    flex items-center justify-center gap-3 p-4 lg:p-6 
                    border-2 border-white/30 rounded-2xl 
                    transition-all duration-300 
                    hover:scale-105 hover:border-white/50 
                    backdrop-blur-sm bg-white/5
                    hover:bg-white/10
                  `}
                >
                  <button.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${button.color}`} />
                  <span className="text-sm lg:text-base font-medium">{button.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Section
          <div className="flex-1">
            <Chat />
          </div>
        )}

        {/* Input Section */}
        <div className="w-full px-4 lg:px-8 py-6">
          <form onSubmit={handleFormSubmit} className="relative flex items-center gap-4 max-w-4xl mx-auto">
            {/* Uploaded Image Preview */}
            {user.imgUrl && (
              <div className="absolute -top-24 left-4 flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={user.imgUrl} 
                    alt="Uploaded" 
                    className="h-20 w-20 object-cover rounded-xl shadow-lg border-2 border-blue-400/50"
                  />
                  <button
                    type="button"
                    onClick={clearUploadedImage}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
                {feature === "modImg" && (
                  <span className="text-xs text-orange-400 mt-1 bg-orange-400/10 px-2 py-1 rounded">
                    Ready to modify
                  </span>
                )}
              </div>
            )}

            {/* Feature Selection Popup */}
            {popUp && (
              <div className="absolute bottom-20 left-4 bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-xl p-3 shadow-2xl z-10">
                <div className="space-y-2">
                  {featureButtons.map((button) => (
                    <div
                      key={button.id}
                      onClick={() => handleFeatureSelect(button.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10"
                    >
                      <button.icon className={`w-5 h-5 ${button.color}`} />
                      <span className="text-sm">{button.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Button */}
            <button
              type="button"
              onClick={() => setPopUp(prev => !prev)}
              className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 border-2 border-white/30 rounded-full hover:bg-gray-700 transition-all duration-200 shadow-lg hover:border-white/50 bg-gray-800"
            >
              <FiPlus className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              placeholder={
                feature === "modImg" 
                  ? "Describe how to modify the image..." 
                  : feature === "genimg" 
                    ? "Describe the image you want to generate..."
                    : "Ask anything..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-12 lg:h-14 bg-gray-800 border-2 border-white/30 rounded-full px-4 lg:px-6 text-sm lg:text-base placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors duration-200 shadow-lg"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaArrowUp className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </form>

          {/* Processing Status */}
         {processingStep && (
  <div className="max-w-4xl mx-auto mt-4 text-center">
    <div className="text-blue-400 text-sm bg-blue-400/10 px-4 py-2 rounded-lg inline-flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      {processingStep}
    </div>
  </div>
)}

          {/* Feature-specific Instructions */}
          <div className="max-w-4xl mx-auto mt-4 text-center">
            {feature === "genimg" && !loading && (
              <p className="text-gray-500 text-xs">
                💡 Tip: Be specific in your descriptions for better results
              </p>
            )}
            
            {feature === "modImg" && user.imgUrl && !loading && (
              <p className="text-gray-500 text-xs">
                🎨 Tip: Describe specific changes like "make it colorful", "add sunset background"
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;