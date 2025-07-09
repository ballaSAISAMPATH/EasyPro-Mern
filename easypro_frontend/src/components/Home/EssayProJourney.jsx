import React, { useEffect } from 'react';
import { PenTool, User, DollarSign, Download, ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EssayProJourney = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: false,
		});
	}, []);

	return (
		<div className="min-h-screen bg-white pt-20 px-4 md:px-20 overflow-hidden">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="font-serif" data-aos="fade-up">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800">
						Your Essay Pro
					</h1>
					<p className="text-2xl md:text-3xl flex items-center text-orange-300 italic font-light">
						Journey......
						<img src="/journey/rocket.png" alt="" className='w-20 ml-3' />
					</p>
				</div>

				{/* Journey Steps Container */}
				<div className="hidden md:block relative -mt-32">
					{/* Step 1 - Top Right */}
					<div
						className="absolute top-0 right-0 w-full md:w-[calc(50%-20px)] mb-8 md:mb-0"
						data-aos="fade-left"
						data-aos-delay="200"
					>
						<div className="bg-orange-50/80 rounded-2xl shadow-lg p-8 relative">
							<div className="absolute top-10 right-10 text-6xl font-semibold text-gray-300">
								1
							</div>
							<div className="mb-4">
								<div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center my-6">
									<PenTool className="w-8 h-8 text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-800">
									Submit your requirements
								</h3>
							</div>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Fill out a quick order form with all the important details - like your topic, academic level, deadline, word count, and any special instructions or files. The more specific you are, the better we can tailor your work.
							</p>
							<button className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center">
								Get started <span className="ml-1"><ArrowRight size={20} /></span>
							</button>
						</div>
					</div>

					{/* Step 2 - Left Side */}
					<div
						className="absolute top-40 left-0 w-full md:w-[calc(50%-20px)] mb-8 md:mb-0"
						data-aos="fade-right"
						data-aos-delay="400"
					>
						<div className="bg-orange-50/80 rounded-2xl shadow-lg p-8 relative">
							<div className="absolute top-10 right-10 text-6xl font-semibold text-gray-300">
								2
							</div>
							<div className="mb-4">
								<div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center my-6">
									<User className="w-8 h-8 text-amber-600" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-4">
								Choose Your Writer
							</h3>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Browse profiles of qualified academic writers, check their ratings, and choose the one you like best. Not sure who to pick? No problem, we'll match you with a top-rated expert in your subject automatically.
							</p>
							<button className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center">
								Get started <span className="ml-1"><ArrowRight size={20} /></span>
							</button>
						</div>
					</div>

					{/* Step 3 - Right Side */}
					<div
						className="absolute top-[26rem] right-0 w-full md:w-[calc(50%-20px)] mb-8 md:mb-0"
						data-aos="fade-left"
						data-aos-delay="600"
					>
						<div className="bg-orange-50/80 rounded-2xl shadow-lg p-8 relative">
							<div className="absolute top-10 right-10 text-6xl font-semibold text-gray-300">
								3
							</div>
							<div className="mb-4">
								<div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center my-6">
									<DollarSign className="w-8 h-8 text-cyan-600" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-4">
								Make Payment Online
							</h3>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Secure your order by making an easy online payment using your preferred method — credit/debit card, UPI, or wallet. Once payment is complete, your writer gets started right away!
							</p>
							<button className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center">
								Get started <span className="ml-1"><ArrowRight size={20} /></span>
							</button>
						</div>
					</div>

					{/* Step 4 - Left Side */}
					<div
						className="absolute top-[36rem] left-0 w-full md:w-[calc(50%-20px)]"
						data-aos="fade-right"
						data-aos-delay="800"
					>
						<div className="bg-orange-50/80 rounded-2xl shadow-lg p-8 relative">
							<div className="absolute top-10 right-10 text-6xl font-semibold text-gray-300">
								4
							</div>
							<div className="mb-4">
								<div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center my-6">
									<Download className="w-8 h-8 text-orange-600" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-4">
								Download Your Paper
							</h3>
							<p className="text-gray-600 mb-8 leading-relaxed">
								When your order is ready, we'll notify you immediately and download the final version all before your deadline. Ready to submit, plagiarism-free and formatted to perfection.
							</p>
							<button className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center">
								Get started <span className="ml-1"><ArrowRight size={20} /></span>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Layout */}
				<div className="md:hidden space-y-8 mt-4">
					{/* Mobile Step 1 */}
					<div className="bg-orange-50/50 rounded-2xl relative flex flex-col gap-3 shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
						<div className="absolute top-4 right-6 text-5xl font-semibold text-gray-300">
							1
						</div>
						<div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center my-3">
							<PenTool className="w-7 h-7 text-blue-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-800">Submit Requirements</h3>
						<p className="text-gray-600 text-sm mb-4">
							Fill out a quick order form with all the important details - topic, academic level, deadline, and special instructions.
						</p>
						<button className="text-orange-500 flex items-center gap-2 font-medium text-sm">Get started <ArrowRight size={20} /></button>
					</div>

					{/* Mobile Step 2 */}
					<div className="bg-orange-50/50 rounded-2xl relative flex flex-col gap-3 shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
						<div className="absolute top-4 right-6 text-5xl font-semibold text-gray-300">
							2
						</div>
						<div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center my-3">
							<User className="w-7 h-7 text-orange-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-800">Choose Writer</h3>
						<p className="text-gray-600 text-sm mb-4">
							Browse qualified academic writers, check ratings, and choose the best fit for your project.
						</p>
						<button className="text-orange-500 flex items-center gap-2 font-medium text-sm">Get started <ArrowRight size={20} /></button>
					</div>

					{/* Mobile Step 3 */}
					<div className="bg-orange-50/50 rounded-2xl relative flex flex-col gap-3 shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
						<div className="absolute top-4 right-6 text-5xl font-semibold text-gray-300">
							3
						</div>
						<div className="w-14 h-14 bg-cyan-100 rounded-lg flex items-center justify-center my-3">
							<DollarSign className="w-7 h-7 text-cyan-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-800">Make Payment</h3>
						<p className="text-gray-600 text-sm mb-4">
							Secure online payment using credit/debit card, UPI, or wallet. Writer starts immediately after payment.
						</p>
						<button className="text-orange-500 flex items-center gap-2 font-medium text-sm">Get started <ArrowRight size={20} /></button>
					</div>

					{/* Mobile Step 4 */}
					<div className="bg-orange-50/50 rounded-2xl relative flex flex-col gap-3 shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
						<div className="absolute top-4 right-6 text-5xl font-semibold text-gray-300">
							4
						</div>
						<div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center my-3">
							<Download className="w-7 h-7 text-orange-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-800">Download Paper</h3>
						<p className="text-gray-600 text-sm mb-4">
							Get notified when ready. Download plagiarism-free, perfectly formatted paper before deadline.
						</p>
						<button className="text-orange-500 flex items-center gap-2 font-medium text-sm">Get started <ArrowRight size={20} /></button>
					</div>
				</div>

				{/* Add spacing for absolute positioned elements */}
				<div className="hidden md:block" style={{ height: '64rem' }}></div>
			</div>
		</div>
	);
};

export default EssayProJourney;