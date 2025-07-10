import { useEffect, useState } from "react";
import { X, User } from 'lucide-react';
import axios from "axios";
const UserModal = ({
  isOpen,
  isClose,
}) => {
  const [userData, setUserData] = useState({
    userName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  
  useEffect(() => {
	console.log(localStorage.getItem("userInfo"));
	console.log(localStorage.getItem("userName"));
	console.log(localStorage.getItem("email"));
	
	
    if (isOpen) {
      const userName = localStorage.getItem('userName');
      const email = localStorage.getItem('email');
      if (userName&& email) {
        setUserData({
          userName:userName,
          email: email,
        });
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleSave = async () => {
	const userId = JSON.parse(localStorage.getItem("userInfo"));
	console.log({...userData,userId:userId._id});
	console.log(`${API_URL}/user/update`);
	
	//const response = await axios.post(`${API_URL}/user/update`,{...userData,userId:userId} );
	const response = await axios.post(`${API_URL}/user/updateUser`,{...userData,userId:userId} );
	console.log(response.data.user.email);
	console.log(response.data.user.userName);
	 setUserData({
          userName:response.data.user.userName,
          email:response.data.user.email,
        });
		localStorage.setItem("userName",response.data.user.userName);
		localStorage.setItem("email",response.data.user.email);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{localStorage.getItem("userName")}</h2>
          <button
            onClick={isClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>
                <button
                  onClick={isEditing ? handleSave : handleEditToggle}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
