import React, { useState } from "react";
import Input from "./Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [formStage, setFormState] = useState(true);
  const navigate = useNavigate();

  async function createUserHandler(e) {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/api/v2/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      console.log(response);

      if (response.data.success === true) {
        alert("✅ Signup successful!");
        localStorage.setItem("authenticated", "false"); // not logged in yet
        navigate("/login"); // go to login form
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert("⚠️ User already exists. Please log in.");
        navigate("/login");
      } else {
        console.error("Signup Error:", err.message);
        alert("❌ Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <>
      {formStage && (
        <div className="min-h-screen bg-gradient-to-br from-sky-300 via-teal-200 to-emerald-100 flex justify-center items-center px-4 relative overflow-hidden animate-fadeIn">
          {/* Decorative cloud pattern */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-10 pointer-events-none z-0"></div>

          <form
            onSubmit={createUserHandler}
            className="relative w-full max-w-lg bg-white/30 backdrop-blur-lg border border-white/40 p-1 rounded-3xl shadow-2xl z-10"
          >
            <div className="flex flex-col gap-6 font-sans text-gray-800">
              <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/30 shadow-xl space-y-5">
                <h2 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-md text-gray-900">
                  🌿 Create Your Weather Account
                </h2>

                <Input
                  inputValue={firstName}
                  type="text"
                  setInputValue={setFirstName}
                  placeholder="First Name"
                  labelName="🧍 First Name"
                />

                <Input
                  inputValue={lastName}
                  type="text"
                  setInputValue={setLastName}
                  placeholder="Last Name"
                  labelName="🧑 Last Name"
                />

                <Input
                  inputValue={email}
                  type="email"
                  setInputValue={setEmail}
                  placeholder="Email Address"
                  labelName="📧 Email"
                />

                <Input
                  inputValue={password}
                  type="password"
                  setInputValue={setPassword}
                  placeholder="Password"
                  labelName="🔒 Password"
                />

                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-white font-bold py-3 rounded-full 
                hover:scale-95 hover:shadow-lg transition-all duration-300 tracking-wide"
                >
                  🌈 Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Signup;
