'use client'
import { ChangeEvent, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from '@hugeicons/core-free-icons';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(isLogin ? 'Login successful!' : 'Account created successfully!');
  };

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
    });
  };
  
  const handleKeyPress = (e : KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Auth Card */}
      <div className="relative border border-white bg-black backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all duration-500">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-black bg-clip-text text-transparent mb-2">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-sm sm:text-base text-white">
            {isLogin ? 'Login to your account' : 'Create your account today'}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-full font-medium transition-all duration-300 ${
              isLogin
                ? 'bg-black text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-full font-medium transition-all duration-300 ${
              !isLogin
                ? 'bg-black text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 sm:space-y-5">
          {!isLogin && (
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <HugeiconsIcon icon={User} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <HugeiconsIcon icon={Mail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <HugeiconsIcon icon={Lock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm text-black sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black hover:text-gray-600 transition-colors"
              >
                {showPassword ? <HugeiconsIcon icon={Eye} className="w-4 h-4 sm:w-5 sm:h-5" /> : <HugeiconsIcon icon={EyeOff} className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue hover:text-black font-medium">
                Forgot password?
              </a>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {isLogin ? 'Login' : 'Create Account'}
            <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-xs sm:text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 sm:mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white hover:text-blue-500 font-semibold bg-black"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}