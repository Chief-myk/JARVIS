import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import bg from "../assets/authBg.png";
import { userDataContext } from "../context/UserContext";
import axios from 'axios';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { serverUrl , userData , setUserData } = useContext(userDataContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (err) setErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErr("");
    
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/register`, 
        formData, // Send formData directly, not wrapped in an object
        { withCredentials: true }
      );
      console.log('Registration successful', result.data);
      setUserData(result.data)
      
      // Redirect to signin page or dashboard after successful registration
      navigate('/');
    } catch (error) {
      console.log('Error', error);
       setUserData(null)
      setErr(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='justify-center items-center flex w-full bg-cover h-[100vh]' style={{ backgroundImage: `url(${bg})` }}>
      <div className='w-[90%] max-w-[500px] bg-[#00000063] backdrop-blur shadow-lg shadow-black flex flex-col items-center gap-6 p-8 rounded-xl'>
        <h2 className='text-2xl font-bold text-white'>Register to Virtual Assistant</h2>
        
        {/* Display error message if exists */}
        {err && (
          <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center">
            {err}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>
          <div className='relative'>
            <input
              className='w-full px-4 py-3 bg-[#ffffff1a] border border-[#ffffff40] rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400'
              type='text'
              name='name'
              id='name'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className='relative'>
            <input
              className='w-full px-4 py-3 bg-[#ffffff1a] border border-[#ffffff40] rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400'
              type='email'
              name='email'
              id='email'
              placeholder='Email Address'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className='relative'>
            <input
              className='w-full px-4 py-3 bg-[#ffffff1a] border border-[#ffffff40] rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10'
              type={showPassword ? "text" : "password"}
              name='password'
              id='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-cyan-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-700 text-white font-medium rounded-lg transition-colors mt-2 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        
        <p className="text-gray-300 mt-4">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;