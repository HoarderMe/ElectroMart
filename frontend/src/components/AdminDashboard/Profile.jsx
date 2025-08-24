// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateProfile, changePassword } from '../../store/slices/authSlice';
// import { toast } from 'react-hot-toast';

// const AdminProfile = () => {
//   const dispatch = useDispatch();
//   const { user, loading, error } = useSelector((state) => state.auth);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     avatar: ''
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [avatarPreview, setAvatarPreview] = useState('');

//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         avatar: user.avatar || ''
//       });
//       setAvatarPreview(user.avatar || '');
//     }
//   }, [user]);

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//         setProfileData(prev => ({
//           ...prev,
//           avatar: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(updateProfile(profileData)).unwrap();
//       toast.success('Profile updated successfully');
//       setIsEditing(false);
//     } catch (error) {
//       toast.error(error.message || 'Failed to update profile');
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }
//     try {
//       await dispatch(changePassword({
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       })).unwrap();
//       toast.success('Password changed successfully');
//       setIsChangingPassword(false);
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       toast.error(error.message || 'Failed to change password');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

//         {/* Profile Information */}
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Profile Information</h2>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               {isEditing ? 'Cancel' : 'Edit Profile'}
//             </button>
//           </div>

//           <form onSubmit={handleProfileSubmit}>
//             <div className="space-y-6">
//               {/* Avatar */}
//               <div className="flex items-center space-x-6">
//                 <div className="relative">
//                   <img
//                     src={avatarPreview || 'https://via.placeholder.com/150'}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                   {isEditing && (
//                     <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                         className="hidden"
//                       />
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </label>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium">{user?.name}</h3>
//                   <p className="text-gray-500">{user?.email}</p>
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={profileData.name}
//                     onChange={handleProfileChange}
//                     disabled={!isEditing}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={profileData.email}
//                     onChange={handleProfileChange}
//                     disabled={!isEditing}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={profileData.phone}
//                     onChange={handleProfileChange}
//                     disabled={!isEditing}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>

//               {isEditing && (
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Change Password */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Change Password</h2>
//             <button
//               onClick={() => setIsChangingPassword(!isChangingPassword)}
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               {isChangingPassword ? 'Cancel' : 'Change Password'}
//             </button>
//           </div>

//           {isChangingPassword && (
//             <form onSubmit={handlePasswordSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Current Password</label>
//                 <input
//                   type="password"
//                   name="currentPassword"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">New Password</label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile; 