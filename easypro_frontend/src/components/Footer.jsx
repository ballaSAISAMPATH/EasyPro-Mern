import React, { useEffect } from 'react';
import {
	Youtube,
	Instagram,
	Linkedin,
	Music,
	Twitter,
	Facebook
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: false,
		});
	}, []);

	return (
		<footer className="bg-white py-16 px-6 md:px-20 overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-12">
					{/* Logo and Social Media Section */}
					<div data-aos="fade-up" data-aos-delay="100">
						<img src="/logoBlack.png" alt="logo" className='w-48' />
						<p className="text-gray-500 text-sm mb-6">© Essay Pro. All rights reserved.</p>

						{/* Social Media Icons */}
						<div className="flex space-x-3">
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Youtube className="w-4 h-4 text-gray-600" />
							</a>
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Instagram className="w-4 h-4 text-gray-600" />
							</a>
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Linkedin className="w-4 h-4 text-gray-600" />
							</a>
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Music className="w-4 h-4 text-gray-600" />
							</a>
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Twitter className="w-4 h-4 text-gray-600" />
							</a>
							<a href="/" className="w-8 h-8 bg-orange-100 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200">
								<Facebook className="w-4 h-4 text-gray-600" />
							</a>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 text-sm md:text-base">
						{/* More Section */}
						<div data-aos="fade-up" data-aos-delay="200">
							<h3 className="text-lg font-semibold text-black mb-6">More</h3>
							<ul className="space-y-4">
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Process
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Writers
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Services
									</a>
								</li>
							</ul>
						</div>

						{/* Services Section */}
						<div data-aos="fade-up" data-aos-delay="300">
							<h3 className="text-lg font-semibold text-black mb-6">Services</h3>
							<ul className="space-y-4">
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Research paper writing
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Coursework writing service
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Powerpoint presentation
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Professional Finance Assignment
									</a>
								</li>
								<li>
									<a href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										Case study writing
									</a>
								</li>
							</ul>
						</div>

						{/* Contact Us Section */}
						<div data-aos="fade-up" data-aos-delay="400">
							<h3 className="text-lg font-semibold text-black mb-6">Contact Us</h3>
							<ul className="space-y-4">
								<li>
									<a href="tel:+918561347856" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										+91 8561347856
									</a>
								</li>
								<li>
									<a href="tel:+918741236589" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
										+91 8741236589
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;