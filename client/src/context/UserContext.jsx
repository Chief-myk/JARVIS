import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  // const serverUrl = "http://localhost:4000";
  const serverUrl = "https://jarvis-5c7u.onrender.com";
  const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null)
      const [backendImage, setBackendImage] = useState(null)
      const [selectedImage, setSelectedImage] = useState(null)

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(res.data);
      console.log("Current user:", res.data);
    } catch (error) {
      console.log("Error loading user data:", error.response?.data || error);
    }
  };

  const getGeminiResponse = async(command)=>{
    try {
      const res = await axios.post(`${serverUrl}/api/user/askToAssistant` , {command} , {withCredentials :true})
      return res.data
      console.log(res.data);
    } catch (error) {
      console.log('error on sending response', error);
      
      
    }
  }

  // ADD THIS MISSING FUNCTION
  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };


  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData, 
    setUserData,
     updateUserData, // ADD THIS TO THE VALUE OBJECT
    selectedImage,
    setBackendImage,
    setFrontendImage,
    setSelectedImage,
    frontendImage,
    backendImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
