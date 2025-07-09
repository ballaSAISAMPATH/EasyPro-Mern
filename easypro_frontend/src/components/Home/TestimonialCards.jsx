import React, { useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TestimonialCards = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: false,
		});
	}, []);

	const testimonials = [
		{
			id: 1,
			name: "Sharon T",
			role: "Student",
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			text: "I had three papers due back-to-back, and honestly, I was drowning. Got my essay in less than 48 hours and scored well. Super impressed with the quality and quick delivery!",
			position: "top-left"
		},
		{
			id: 2,
			name: "Sarah Johnson",
			role: "Student",
			image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
			rating: 5,
			text: "Was skeptical at first, but the writer totally nailed my research paper. It was original, well-structured, and even cited properly. Will definitely use it again when I'm stuck.",
			position: "middle-right"
		},
		{
			id: 3,
			name: "Rahul K",
			role: "Student",
			image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			text: "The live chat support helped me pick the right service, and the writer followed every instruction perfectly. Just asked for one revision, and they handled it in hours.",
			position: "bottom-right"
		}
	];

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
			/>
		));
	};

	return (
		<div className="min-h-screen py-16 px-4 md:px-20 relative overflow-hidden"
			style={{
				backgroundImage: "url('/heroBg.png')",
				backgroundSize: "cover",
				backgroundPosition: "bottom"
			}}>
			<div className="relative max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16" data-aos="fade-down">
					<h2 className="flex md:flex-row flex-col gap-3 justify-center text-4xl md:text-5xl font-serif text-gray-800 mb-24">
						Hear From Our
						<span className="italic text-orange-400 relative">
							Happy Students
							<svg className="absolute md:-bottom-9 -bottom-6 left-0 w-full md:h-8" width="247" height="21" viewBox="0 0 247 21" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 18C11.0855 11.3497 45.1621 -4.89571 122.829 7.58137C200.495 20.0584 220.531 13.0719 246 4.81896" stroke="#FDA37E" strokeWidth="3" />
							</svg>
						</span>
					</h2>
				</div>

				{/* Testimonial Cards Container */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-8 px-4'>
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
							data-aos="fade-up"
						>
							<div className="absolute -top-10 md:-left-4 flex justify-between items-center mb-4">
								<img
									src={testimonial.image}
									alt={testimonial.name}
									className="w-20 h-20 rounded-md object-cover flex-shrink-0"
								/>
								<div className="flex min-w-56 md:min-w-[95%] flex-1 justify-between items-center h-16 bg-black rounded-r-md p-3">
									<div className="text-white">
										<h3 className="font-semibold text-sm">{testimonial.name}</h3>
										<p className="text-xs text-gray-300">{testimonial.role}</p>
									</div>
									<span className='flex'>{renderStars(testimonial.rating)}</span>
								</div>
							</div>
							<Quote className="absolute -bottom-8 right-8 w-20 h-20 text-gray-300 fill-gray-300 transform" />
							<p className="text-gray-700 leading-relaxed py-6 px-4">
								{testimonial.text}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TestimonialCards;