'use client'
import { ChangeEvent, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {handleSignIn} from '../api';
// import { signIn } from '@/auth';

export default function AuthPage() {
  // const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validatePassword = (password: string) => {
  //   if (isLogin) {
  //     return password.length >= 6;
  //   } else {
  //     // For signup: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  //     const hasUpperCase = /[A-Z]/.test(password);
  //     const hasLowerCase = /[a-z]/.test(password);
  //     const hasNumber = /[0-9]/.test(password);
  //     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  //     const isLongEnough = password.length >= 8;

  //     return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
  //   }
  // };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: ''
    };

    // Validate name for signup
    // if (!isLogin && formData.name.trim().length < 5) {
    //   newErrors.name = 'Name must be at least 5 characters';
    // }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    // if (!formData.password) {
    //   newErrors.password = 'Password is required';
    // } else if (isLogin && formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // } else if (!isLogin && !validatePassword(formData.password)) {
    //   newErrors.password = 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character';
    // }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async () => {

    // "use server"
    if (validateForm()) {
      setLoading(true);
      const result = await handleSignIn(formData.email, formData.password);
      setLoading(false);
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setErrorMessage('');
      }
      // console.log('Form submitted:', formData);
      // alert('Login successful!');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Auth Card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 transform transition-all duration-500">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base">
            Login to your account
          </p>
        </div>


        {/* Input Fields */}

        {errorMessage && (
          <p className="mb-4 text-center text-sm sm:text-base text-red-300">{errorMessage}</p>
        )}
        <div className="space-y-4 sm:space-y-5">

          <div className="relative">
            <label className="block text-xs sm:text-sm mb-2">
              Email Address
            </label>
            <div className="relative">
              <HugeiconsIcon icon={Mail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-xl focus:border-white outline-none transition-all"
                placeholder="you@example.com"
                aria-autocomplete='none'
                autoComplete='off'
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-300">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs sm:text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <HugeiconsIcon icon={Lock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-xl focus:border-white outline-none transition-all"
                placeholder={showPassword ? "strong password" : '••••••••'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black hover:text-gray-600 transition-colors"
              >
                {showPassword ? <HugeiconsIcon icon={Eye} className="w-4 h-4 sm:w-5 sm:h-5" /> : <HugeiconsIcon icon={EyeOff} className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-300">{errors.password}</p>
            )}
          </div>


          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded w-4 h-4" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue hover:text-black font-medium">
              Forgot password?
            </a>
          </div>

          <Button
            variant="default"
            onClick={handleSubmit}
            className='w-full hover:bg-accent/90 group'
            disabled={loading}
          >
            Login
            <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Divider */}
        <div className="my-5 sm:my-6 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-xs sm:text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Footer */}
        {/* Footer */}
        <div className="flex justify-center items-center">
          <p className="text-sm">
            Don't have an account?
          </p>
          <Link
            href="/auth/sign-in"
          >
            <Button
              variant="link"
              className="link-btn"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}