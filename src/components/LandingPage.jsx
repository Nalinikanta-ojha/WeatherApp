import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-green-400 flex items-center justify-center px-6 py-10">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-10 max-w-3xl w-full flex flex-col items-center animate-fade-in">
        <h1 className="text-5xl font-extrabold text-white text-center drop-shadow-lg mb-4">
          ☀️ Welcome to <span className="text-yellow-200">Weather App</span>
        </h1>

        <p className="text-white/90 text-lg text-center mb-8 max-w-md">
          Get real-time weather updates .
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 w-full sm:w-auto"
          >
            🌈 Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 w-full sm:w-auto"
          >
            🌿 Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
