import { Link } from "react-router-dom";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="text-center max-w-md">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-5 rounded-full">
            <BookOpen size={40} className="text-blue-600" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-500 mb-6">
          Looks like this page doesn’t exist or has been moved.
          Let’s get you back to learning 📚
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 flex-wrap">
          
          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Home size={18} />
            Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default PageNotFound;