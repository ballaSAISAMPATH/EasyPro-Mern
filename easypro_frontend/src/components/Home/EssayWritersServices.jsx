import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EssayWritersServices = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [visibleCount, setVisibleCount] = useState(getVisibleCount());

	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: false,
		});

		const handleResize = () => {
			setVisibleCount(getVisibleCount());
			setCurrentSlide(0); // optional: reset position on resize
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const writers = [
		{
			id: 1,
			name: "Amit Mishra",
			expertise: "AI/ML and NLP",
			rating: 4.8,
			ordersCompleted: 52,
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
		},
		{
			id: 2,
			name: "Rahul Sharma",
			expertise: "Mathematics",
			rating: 4.8,
			ordersCompleted: 35,
			image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
		},
		{
			id: 3,
			name: "Kamala Menon",
			expertise: "Coding",
			rating: 4.8,
			ordersCompleted: 41,
			image: "https://images.unsplash.com/photo-1494790108755-2616b332c61c?w=400&h=400&fit=crop&crop=face"
		},
		{
			id: 4,
			name: "John Siay",
			expertise: "Science",
			rating: 4.8,
			ordersCompleted: 26,
			image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
		},
		{
			id: 5,
			name: "Sarah Johnson",
			expertise: "Literature",
			rating: 4.9,
			ordersCompleted: 67,
			image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
		},
		{
			id: 6,
			name: "Michael Chen",
			expertise: "Business",
			rating: 4.7,
			ordersCompleted: 43,
			image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face"
		}
	];

	const services = [
		"Research paper writing service",
		"Coursework writing service",
		"Case study writing service",
		"Powerpoint presentation service",
		"Professional Finance Assignment Help"
	];

	const totalSlides = writers.length;
	const totalWindows = Math.max(totalSlides - visibleCount + 1, 1);

	function getVisibleCount() {
		const width = window.innerWidth;
		if (width >= 1024) return 4;  // desktop
		if (width >= 768) return 3;   // tablet
		return 1;                     // mobile
	}

	const nextSlide = () => {
		setCurrentSlide(prev => {
			if (prev + 1 >= totalWindows) {
				return 0;
			}
			return prev + 1;
		});
	};

	const prevSlide = () => {
		setCurrentSlide(prev => {
			if (prev - 1 < 0) {
				return totalWindows - 1;
			}
			return prev - 1;
		});
	};

	// Auto-play carousel - one card at a time
	useEffect(() => {
		if (!isPaused) {
			const interval = setInterval(nextSlide, 2000);
			return () => clearInterval(interval);
		}
	}, [isPaused]);

	const handleMouseEnter = () => {
		setIsPaused(true);
	};

	const handleMouseLeave = () => {
		setIsPaused(false);
	};

	return (
		<div className="bg-white py-16 px-4 md:px-20 overflow-hidden">
			<div className="max-w-7xl mx-auto bg-orange-50/50 rounded-3xl shadow-2xl overflow-hidden relative"
				style={{
					backgroundImage: `url("/writersBg.png")`,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "top"
				}}
			>
				<div className="p-8 md:p-12">
					{/* Header */}
					<div className="text-center mb-12" data-aos="fade-up">
						<h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-20">
							Meet Our Top <span className="text-orange-400 italic relative">
								Essay Writers
								<svg className="absolute -bottom-6 left-0 w-full" width="247" height="21" viewBox="0 0 247 21" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2 18C11.0855 11.3497 45.1621 -4.89571 122.829 7.58137C200.495 20.0584 220.531 13.0719 246 4.81896" stroke="#FDA37E" strokeWidth="3" />
								</svg>
							</span>
						</h2>
					</div>

					{/* Carousel Container */}
					<div
						className="mb-12 relative"
						data-aos="fade-up"
						data-aos-delay="200"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<div className="overflow-hidden">
							<div
								className="flex transition-transform duration-500 ease-in-out" style={{
									transform: `translateX(calc(-${currentSlide * (100 / visibleCount)}% - ${currentSlide * (1.5 / visibleCount)}rem))`,
									gap: '1.5rem'
								}}
							>
								{writers.map((writer) => (
									<div
										key={writer.id}
										className="flex-shrink-0 w-full md:[width:calc(33.333%-1rem)] lg:[width:calc(25%-1.125rem)] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
									>
										<div className="relative h-64 md:h-72">
											<img
												src={writer.image}
												alt={writer.name}
												className="w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
											<div className="absolute bottom-4 left-4 right-4 text-white">
												<h3 className="text-lg md:text-xl font-bold mb-1">{writer.name}</h3>
												<p className="text-xs md:text-sm text-gray-200 mb-2">Expert in: <span className="text-white font-medium">{writer.expertise}</span></p>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<span className="text-base md:text-lg font-bold mr-1">{writer.rating}</span>
														<Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
													</div>
													<p className="text-xs md:text-sm">Orders: <span className="font-bold">{writer.ordersCompleted}</span></p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Navigation Arrows */}
						<button
							onClick={prevSlide}
							className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
						>
							<ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
						>
							<ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
						</button>
					</div>

					{/* Dots Indicator */}
					<div className="flex justify-center my-6 md:my-8 space-x-2">
						{Array.from({ length: totalWindows }).map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentSlide(index)}
								className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-orange-400 w-6 md:w-8' : 'bg-gray-300'
									}`}
							/>
						))}
					</div>

					{/* Find Expert Button */}
					<button className="bg-cyan-400 hover:bg-cyan-500 text-gray-700 px-10 py-2 rounded-full font-semibold transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1">
						Find your expert
					</button>
				</div>

				{/* Services Section */}
				<div className="p-8 md:p-12">
					<h2 data-aos="fade-up" className="text-4xl md:text-5xl flex flex-col md:flex-row gap-3 justify-center items-center font-serif text-gray-800 my-8">
						<span className="flex gap-3">
							Popular
							<span className="text-orange-400 italic relative">
								Services
								<svg className='absolute -bottom-6 left-0 w-full' width="289" height="29" viewBox="0 0 289 29" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.01074 19.268C53.5438 12.5816 182.68 -0.0890369 286.961 2.7192" stroke="#FDA37E" strokeWidth="3.72072" />
									<path d="M41.2051 26.6832C79.1365 21.6685 174.188 12.1654 250.945 14.2716" stroke="#FDA37E" strokeWidth="3.72072" />
								</svg>
							</span>
						</span>
						Offered
					</h2>
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						{/* Left Side - Services List */}
						<div className="order-2 md:order-1 w-fit">
							{services.map((service, index) => (
								<div
									key={index}
									className="border-b border-gray-300 py-4"
									data-aos="fade-up"
									data-aos-offset={index * 10}
								>
									<h3 className="text-lg text-gray-800 hover:text-orange-600 transition-colors">
										{service}
									</h3>
								</div>
							))}
						</div>

						{/* Right Side - Enhanced Illustration */}
						<div className="relative order-1 md:order-2" data-aos="fade-left">
							<img src="/research.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div >
	);
};

export default EssayWritersServices;