import React, { useState } from "react";
import Input from "./Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v2/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authenticated", "true"); // ✅ Set auth state
        alert("✅ Login successful!");
        navigate("/weather"); // ✅ Go to weather page
      } else {
        alert("❌ Invalid credentials. Try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("❌ Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-200 to-yellow-100 flex justify-center items-center px-4 relative overflow-hidden">
      {/* Cloudy background overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-10 pointer-events-none"></div>

      <form
        className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 p-10 rounded-3xl shadow-2xl font-sans z-10"
        onSubmit={loginHandler}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8 drop-shadow tracking-wide">
          ☁️ Weather Login
        </h2>

        <div className="flex flex-col gap-6">
          <Input
            inputValue={email}
            type="email"
            setInputValue={setEmail}
            placeholder="Enter your email"
            labelName="📧 Email"
          />
          <Input
            inputValue={password}
            type="password"
            setInputValue={setPassword}
            placeholder="Enter your password"
            labelName="🔒 Password"
          />

          <button
            type="submit"
            className="mt-2 w-full bg-gradient-to-r from-sky-400 via-teal-400 to-green-300 text-white font-bold py-3 rounded-full hover:scale-95 hover:shadow-lg transition-all duration-300 tracking-wide"
          >
            🌤️ Login Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
