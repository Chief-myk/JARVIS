import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import {
  FaRobot,
  FaMicrochip,
  FaCogs,
  FaHands,
  FaMicrophone,
  FaEye,
  FaCamera,
  FaImage,
  FaSignOutAlt,
  FaPowerOff,
  FaVolumeUp,
  FaWifi,
  FaBatteryFull,
  FaBell,
  FaCog,
  FaTimes,
  FaUser,
  FaMicrophoneSlash
} from 'react-icons/fa';
import { GiMechanicalArm } from 'react-icons/gi';
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"

const Home = ({ systemStatus }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'System initialized successfully', type: 'success', time: '2 min ago' },
    { id: 2, message: 'Voice module calibrated', type: 'info', time: '5 min ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { serverUrl, userData, setUserData , getGeminiResponse } = useContext(userDataContext);
  const [stopService, setStopService] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const floatingVariants = {
    initial: { y: -10 },
    animate: {
      y: [0, -15, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      addNotification('Speech recognition not supported in this browser', 'error');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Hindi and English

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isListening) {
        // Restart recognition if it's still supposed to be listening
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
            }
          }
        }, 100);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Transcript:', transcript);
      setCurrentTranscript(transcript);

      if (transcript.toLowerCase().includes(userData?.assistantName?.toLowerCase() || "javed")) {
        setIsProcessing(true);
        try {
          const data = await getGeminiResponse(transcript);
          console.log('AI Response:', data);
          if (data && data.response) {
            handleCommand(data);
          }
        } catch (error) {
          console.error('Error processing command:', error);
          addNotification('Error processing voice command', 'error');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Ignore no-speech errors and continue listening
        return;
      }
      setIsListening(false);
      addNotification(`Speech recognition error: ${event.error}`, 'error');
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      // Stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      setIsListening(false);
      setCurrentTranscript('');
      addNotification('Voice recognition stopped', 'info');
    } else {
      // Start recognition
      const recognition = setupSpeechRecognition();
      if (recognition) {
        try {
          recognition.start();
          addNotification('Voice recognition started - Speak in Hindi or English', 'success');
        } catch (error) {
          console.error('Failed to start recognition:', error);
          addNotification('Failed to start voice recognition', 'error');
        }
      }
    }
  };

  const toggleVoiceControl = async () => {
    toggleVoiceRecognition();
  };

  const toggleGestureControl = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/start/gesture_control");
    console.log(res.data);
    setStopService(true);
  };

  const toggleObjectDetection = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/start/object_detection");
    console.log(res.data);
    setStopService(true);
  };

  const toggleFaceDetection = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/start/face_recognition");
    console.log(res.data);
    setStopService(true);
  };

  const ImageProcess = async () => {
    navigate("/imageGenAndProcess")
  }
  const GenImage = async () => {
    navigate("/imageGenAndProcess")
  }

  const features = [
    {
      icon: <FaMicrophone className="w-6 h-6" />,
      title: "Voice Commands",
      description: "Control with 'Open Google', 'Play music'",
      color: "from-blue-500 to-cyan-500",
      action: toggleVoiceControl
    },
    {
      icon: <FaHands className="w-6 h-6" />,
      title: "Gesture Control",
      description: "Hand-controlled mouse and interactions",
      color: "from-purple-500 to-pink-500",
      action: toggleGestureControl
    },
    {
      icon: <FaEye className="w-6 h-6" />,
      title: "Object Detection",
      description: "Real-time object recognition",
      color: "from-green-500 to-emerald-500",
      action: toggleObjectDetection
    },
    {
      icon: <FaCamera className="w-6 h-6" />,
      title: "Face Recognition",
      description: "Secure facial authentication",
      color: "from-orange-500 to-red-500",
      action: toggleFaceDetection
    },
    {
      icon: <FaImage className="w-6 h-6" />,
      title: "Image Processing",
      description: "Upload and analyze images",
      color: "from-teal-500 to-blue-500",
      action: ImageProcess
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI Generation & Modification",
      description: "Create images with AI",
      color: "from-violet-500 to-purple-500",
      action: GenImage
    }
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log('Logout successful');
      setUserData(null);
      navigate("/signin");
    } catch (err) {
      console.error('Logout error:', err);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: 'Logout failed. Please try again.',
        type: 'error',
        time: 'Just now'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(),
      message,
      type,
      time: 'Just now'
    }, ...prev.slice(0, 4)]);
  };

  const StopService = async () => {
    const res = await axios.get("http://127.0.0.1:5000/api/stop/all");
    console.log(res.data);
    setStopService(false);
  };

  const speak = (text) => {
    console.log('Speaking:', text);
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN, en-US'; // Support Hindi and English
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        console.log('Speech finished');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };
      
      window.speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
    } else {
      console.log('Speech synthesis not supported');
      addNotification('Text-to-speech not supported in this browser', 'error');
    }
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    // Speak the response first
    if (response) {
      speak(response);
    }

    // Helper function to open URLs in a new tab
    const openURL = (url) => window.open(url, "_blank");

    // Wait a bit before executing the action to allow speech to start
    setTimeout(() => {
      switch (type) {
        case "google-search":
          if (userInput) {
            openURL(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
          }
          break;

        case "calculator-open":
          openURL("https://www.desmos.com/scientific");
          break;

        case "instagram-open":
          openURL("https://www.instagram.com/");
          break;

        case "facebook-open":
          openURL("https://www.facebook.com/");
          break;

        case "weather-show":
          openURL("https://www.weather.com/");
          break;

        case "youtube-search":
        case "youtube-play":
          if (userInput) {
            openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
          }
          break;
          
        default:
          // For other commands, just speak the response
          break;
      }
    }, 500);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-blue-950 text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Voice Status Indicator */}
      {(isListening || isProcessing) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 left-4 z-50 flex items-center space-x-3 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
        >
          {isListening && (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Listening...</span>
              <FaMicrophone className="text-green-500 animate-pulse" />
            </>
          )}
          {isProcessing && (
            <>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm">Processing...</span>
            </>
          )}
        </motion.div>
      )}

      {/* Current Transcript Display */}
      {currentTranscript && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 right-4 z-50 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/20 max-w-md mx-auto"
        >
          <p className="text-sm text-center">{currentTranscript}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-3 z-50">
        {/* Voice Control Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleVoiceRecognition}
          className={`p-2 rounded-full backdrop-blur-sm border transition-colors ${isListening
              ? 'bg-green-500/20 border-green-500/30 text-green-400'
              : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
        >
          {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors relative"
        >
          <FaBell />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
        >
          <FaCog />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          disabled={isLoading}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-red-500/50 transition-colors flex items-center"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <FaSignOutAlt />
          )}
        </motion.button>
      </div>

      {/* Stop Service Panel */}
      {stopService && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={StopService}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 transition-all duration-300 disabled:opacity-50"
        >
          <span className="text-sm">STOP</span>
        </motion.button>
      )}

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-4 w-80 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>
                <FaTimes className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${notification.type === 'success' ? 'border-green-500 bg-green-500/10' :
                      notification.type === 'error' ? 'border-red-500 bg-red-500/10' :
                        'border-blue-500 bg-blue-500/10'
                    }`}>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs opacity-60 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-white/60">No notifications</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-md border-l border-white/20 z-40 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <FaTimes className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">System Controls</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span>Voice Control</span>
                    <button
                      onClick={toggleVoiceControl}
                      className={`w-12 h-6 rounded-full relative ${isListening ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isListening ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span>Gesture Control</span>
                    <button
                      onClick={toggleGestureControl}
                      className={`w-12 h-6 rounded-full relative ${systemStatus?.gestureActive ? 'bg-purple-500' : 'bg-gray-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${systemStatus?.gestureActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">User Profile</h3>
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <FaUser className="text-xl" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{userData?.username || 'User'}</p>
                    <p className="text-sm opacity-60">{userData?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Voice Settings</h3>
                <div className="space-y-2">
                  <p className="text-sm opacity-75">Language: Hindi/English</p>
                  <p className="text-sm opacity-75">Recognition: {isListening ? 'Active' : 'Inactive'}</p>
                  <p className="text-sm opacity-75">Processing: {isProcessing ? 'Busy' : 'Ready'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of your existing JSX remains the same... */}
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 opacity-5">
        <GiMechanicalArm className="text-blue-500 text-9xl" />
      </div>
      <div className="absolute bottom-60 right-20 opacity-5">
        <FaCogs className="text-blue-500 text-9xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-20"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -8, 0, 6, 0],
              x: [0, 4, 0, -6, 0],
              opacity: [0.1, 0.3, 0.15, 0.25, 0.1],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-5xl pt-24 sm:pt-32 lg:pt-6 text-center z-10 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-60 h-60 rounded-4xl bg-gradient-to-r from-purple-500 to-blue-500 p-1">
                {userData?.assistantImage ? (
                  <img
                    src={userData.assistantImage}
                    alt="Assistant"
                    className="w-full h-full rounded-4xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-4xl bg-gray-800 flex items-center justify-center">
                    <FaRobot className="text-5xl text-white" />
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-blue-950 flex items-center justify-center ${isListening ? 'bg-green-500 animate-pulse' :
                  isProcessing ? 'bg-blue-500 animate-spin' : 'bg-gray-500'
                }`}>
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4"
          >
            Hi {userData?.username || 'Boss'}! I'm {userData?.assistantName || 'ARIA'}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg opacity-75 max-w-2xl mx-auto mb-8"
          >
            Your intelligent AI assistant ready to help with Hindi/English voice commands, gesture control, and smart automation.
          </motion.p>
        </motion.div>

{/* <div className='mx-auto'>
  {isProcessing && <img src={aiImg} alt="" className='w-[200px]' />}
  {currentTranscript && <img src={userImg} alt="" className='w-[200px]' />}
</div> */}

        {/* Feature Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12 px-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
              onClick={feature.action}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-75 leading-relaxed">{feature.description}</p>
              </div>

              {/* Hover effect */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-8 mb-8"
        >
          {[
            { label: "Voice Control", active: isListening, color: "blue" },
            { label: "Processing", active: isProcessing, color: "orange" },
            { label: "Gesture Control", active: systemStatus?.gestureActive, color: "purple" },
            { label: "AI Ready", active: true, color: "green" },
            { label: "System Active", active: systemStatus?.connected, color: "cyan" }
          ].map((status, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${status.active
                  ? `bg-${status.color}-500/20 border-${status.color}-500/30`
                  : 'bg-gray-500/20 border-gray-500/30'
                }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${status.active
                  ? `bg-${status.color}-400 animate-pulse`
                  : 'bg-gray-400'
                }`}></div>
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <FaRobot className="absolute top-20 right-20 w-32 h-32 text-purple-500" />
        <FaCogs className="absolute bottom-20 left-20 w-32 h-32 text-cyan-500 animate-spin" style={{ animationDuration: '20s' }} />
        <FaMicrochip className="absolute top-1/3 left-1/4 w-32 h-32 text-pink-500" />
      </div>

      <Footer />
    </div>
  );
};

export default Home;