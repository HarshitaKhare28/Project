import { useState } from "react";


const Loginsignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleClick = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };
  return (
<div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800">{isLogin ? "Login" : "Sign Up"}</h2>
    <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
  </div>

  <div className="space-y-4">
    {!isLogin && (
      <div className="border border-gray-300 rounded-lg px-3 py-2">
        <input
          type="text"
          placeholder="Name"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    )}

    <div className="border border-gray-300 rounded-lg px-3 py-2">
      <input
        type="email"
        placeholder="Email id"
        className="w-full outline-none text-gray-700 placeholder-gray-400"
      />
    </div>

    <div className="border border-gray-300 rounded-lg px-3 py-2">
      <input
        type="password"
        placeholder="Password"
        className="w-full outline-none text-gray-700 placeholder-gray-400"
      />
    </div>
  </div>

  <div className="text-sm text-right mt-3 text-gray-500">
    Lost password? <span className="text-blue-500 hover:underline cursor-pointer">Click here</span>
  </div>

  <div className="mt-6 text-center">
    <button
      className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
      onClick={handleClick}
    >
      {isLogin ? "Go to Sign Up" : "Go to Login"}
    </button>
  </div>
</div>

  );
};

export default Loginsignup;
