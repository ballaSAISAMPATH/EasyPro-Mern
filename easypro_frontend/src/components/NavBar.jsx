import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import AuthModal from './AuthModal';
import LogoutModal from './LogoutModal';
import { useNavigate } from 'react-router-dom';
import UserModal from './User/UserModal';
const NavBar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [username,setUserName]=useState("");
	const navigate = useNavigate();

	const navLinks = [
		{
			label: "Services", links: [
				{ label: 'Essay Writing', link: "/" },
				{ label: 'Plagiarism Checker', link: "/" },
				{ label: 'Paraphrasing', link: "/" },
				{ label: 'Thesis Writing', link: "/" },
				{ label: 'Powerpoint Presentation', link: "/" },
				{ label: 'Homework', link: "/" },
				{ label: 'Assignment Help', link: "/" }
			]
		},
		{
			label: "Resources", links: [
				{ label: 'Thesis Writings', link: "/" },
				{ label: 'Essay Writings', link: "/" },
				{ label: 'Study Notes', link: "/" },
				{ label: 'Documents', link: "/" }
			]
		},
		{ label: "How it works", link: "/howitworks" },
		{ label: "Top Writers", link: "/top-writers" },
		{
			label: "Who Are We", links: [
				{ label: 'Reviews', link: "/reviews" },
				{ label: 'FAQS', link: "/faqs" },
				{ label: 'Contact Us', link: "/contactus" }
			]
		}
	];

	const loggedNavLinks = [
		{ label: "My Orders", link: "/user/orders" },
		{ label: "Top Writers", link: "/top-writers" },
		{
			label: "Services", links: [
				{ label: 'Essay Writing', link: "/" },
				{ label: 'Plagiarism Checker', link: "/Plagiarism_Checker" },
				{ label: 'Paraphrasing', link: "/" },
				{ label: 'Thesis Writing', link: "/" },
				{ label: 'Powerpoint Presentation', link: "/" },
				{ label: 'Homework', link: "/" },
				{ label: 'Assignment Help', link: "/" }
			]
		},
		{
			label: "Resources", links: [
				{ label: 'Thesis Writings', link: "/res", type: "thesis" },
				{ label: 'Essay Writings', link: "/resources", type: "essay" },
				{ label: 'Study Notes', link: "/resources", type: "study notes" },
				{ label: 'Research Papers', link: "/resources", type: "research papers" },
				{ label: 'Exam Papers', link: "/resources", type: "exam papers" },
				{ label: 'Guide', link: "/resources", type: "guide" },
				{ label: 'Journals', link: "/resources", type: "journals" },
			]
		},
		{ label: "Place Order", link: "/order" }
	];

	const userProfileDropdown = [
		{ icon: <User className='w-4' />, label: 'Profile', action: () =>{
			setIsUserModalOpen(true);
			
		}  },
		{ icon: <LogOut className='w-4' />, label: 'Logout', action: () => setIsLogoutModalOpen(true) }
	];
	
	const handleLogout = () => {
		setIsAuthenticated(false);
		setUser(null);
		setIsLogoutModalOpen(false);
		localStorage.removeItem('token');
		localStorage.removeItem('userInfo');
		navigate('/');
	};

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('userInfo'));
		const userNamee = localStorage.getItem('userName');
		const token = localStorage.getItem('token');
		if (storedUser && token) {
			if (storedUser.role === "admin") {
				window.location.replace('/admin/home');
			}
			setUser(storedUser);
			setUserName(userNamee);
			setIsAuthenticated(true);
		}
	}, [isModalOpen,username]);

	const handleDropdownEnter = (dropdown) => {
		setActiveDropdown(dropdown);
	};

	const handleDropdownLeave = () => {
		setActiveDropdown(null);
	};

	return (
		<div className="bg-white mb-10 md:mb-20">
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white rounded-none md:px-20 px-4 py-3">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<img src="/logoBlack.png" onClick={() => navigate('/')} className='w-28 md:w-40 cursor-pointer' alt="logo" />

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						{!isAuthenticated ? (
							<>
								{navLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<a
																key={dropdownIndex}
																href={dropdownItem.link}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</a>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}
							</>
						) : (
							<>
								{loggedNavLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<span
																key={dropdownIndex}
																onClick={() => navigate(dropdownItem.link, {
																	state: dropdownItem.type ? { type: dropdownItem.type } : undefined
																})}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</span>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}
							</>
						)}
					</div>

					{/* Login Button / User Profile */}
					<div className="flex items-center justify-between space-x-2">
						{!isAuthenticated ? (
							<button
								className="text-sm md:text-base bg-red-400 hover:bg-orange-300 text-white px-4 py-2 rounded-full transition-colors"
								onClick={() => setIsModalOpen(true)}
							>
								Log in
							</button>
						) : (
							<div
								className="relative"
								onMouseEnter={() => handleDropdownEnter('userProfile')}
								onMouseLeave={handleDropdownLeave}
							>
								<button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
									<img
										src={user?.profilePic}
										alt={user?.userName}
										className="w-8 h-8 rounded-full"
									/>
									<span className="hidden md:block">{username}</span>
									<ChevronDown className="w-4 h-4" />
								</button>

								{activeDropdown === 'userProfile' && (
									<div
										className="absolute top-6 right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
										onMouseEnter={() => handleDropdownEnter('userProfile')}
										onMouseLeave={handleDropdownLeave}
									>
										{userProfileDropdown.map((item, index) => (
											<button
												key={index}
												onClick={item.action}
												className={`flex gap-2 items-center w-full text-left px-4 py-2 text-sm ${item.label === 'Logout' ? "text-red-500" : "text-gray-700"} hover:bg-gray-100 first:rounded-t-md last:rounded-b-md`}
											>
												{item.icon}
												{item.label}
											</button>
										))}
									</div>
								)}
							</div>
						)}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden text-gray-700 hover:text-gray-900"
						>
							<Menu className="w-6 h-6" />
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			<div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}>
				<div
					className={`fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
						}`}
				>
					{/* Mobile Menu Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div className="text-xl font-bold text-gray-800">Menu</div>
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="p-2 text-gray-700 hover:text-gray-900"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Mobile Menu Items */}
					<div className="p-4 space-y-4 flex flex-col">
						{!isAuthenticated ? (
							<>
								{navLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<a
																key={dropdownIndex}
																href={dropdownItem.link}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</a>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}
							</>
						) : (
							<>
								{/* User Profile Section */}
								<div className="pb-4 border-b">
									<div className="flex items-center space-x-3">
										<img
											src={user?.profilePic}
											alt={user?.userName}
											className="w-10 h-10 rounded-full"
										/>
										<div>
											<div className="font-semibold text-gray-800">{username}</div>
											<div className="text-sm text-gray-600">{user?.email}</div>
										</div>
									</div>
								</div>

								{loggedNavLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<a
																key={dropdownIndex}
																href={dropdownItem.link}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</a>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}

								{/* Profile Actions */}
								<div className="pt-4 border-t space-y-2">
									{userProfileDropdown.map((item, index) => (
										<button
											key={index}
											onClick={item.action}
											className={`flex gap-2 items-center w-full text-left py-2 ${item.label === 'Logout' ? "text-red-500" : "text-gray-700"}`}
										>
											{item.icon}
											{item.label}
										</button>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<AuthModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			<LogoutModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleLogout}
			/>

			<UserModal
				isOpen={isUserModalOpen}
				isClose={()=>setIsUserModalOpen(false)}
			/>
		</div>
	);
};

export default NavBar;