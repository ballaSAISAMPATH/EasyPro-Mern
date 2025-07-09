import React, { useState } from 'react';
import { Paperclip, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		instructions: '',
		files: []
	});

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			instructions: e.target.value
		});
	};

	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files);
		setFormData({
			...formData,
			files: [...formData.files, ...files]
		});
	};

	const handleSubmit = () => {
		navigate('/order', {
			state: formData,
		})
		console.log('Form submitted:', formData);
	};

	return (
		<div className="min-h-screen bg-[#fff9f4] flex items-center justify-center mx-4 md:mx-16 px-6 py-8 rounded-b-3xl overflow-hidden"
			style={{
				backgroundImage: "url('/heroBg.png')",
				backgroundSize: "cover",
				backgroundPosition: "bottom"
			}}
		>
			<div className="w-full max-w-4xl">
				{/* Main Hero Content */}
				<div className="text-center mb-12">
					<h1 className="text-xl md:text-4xl font-serif text-gray-800 my-14 leading-tight">
						Get High-Quality Academic Help. On<br />
						Time, Every Time.
					</h1>

					{/* Order Form */}
					<div className="bg-[#fffbf7] rounded-3xl text-sm md:text-base shadow-lg p-6 mb-12 max-w-3xl mx-auto">
						<div className="space-y-4">
							{/* Text Area */}
							<div>
								<textarea
									value={formData.instructions}
									onChange={handleInputChange}
									placeholder="Give a short note on what you want"
									className="w-full h-32 px-4 py-3 border border-orange-300 bg-[#fffbf7] rounded-3xl resize-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-gray-700"
								/>
							</div>

							{/* Form Actions */}
							<div className="flex gap-3 justify-between items-center">
								{/* File Upload */}
								<div className="relative">
									<input
										type="file"
										multiple
										onChange={handleFileUpload}
										className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
										id="file-upload"
									/>
									<label
										htmlFor="file-upload"
										className="flex items-center gap-2 bg-cyan-300 hover:bg-cyan-400 text-gray-800 md:px-4 p-2 rounded-lg cursor-pointer transition-colors"
									>
										<Paperclip className="w-4 h-4" />
										<span className="hidden md:block">Attach Files</span>
									</label>
								</div>

								{/* Submit Button */}
								<button
									onClick={handleSubmit}
									className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-600 px-6 py-2 rounded-lg transition-colors"
								>
									Submit
									<ArrowRight className="w-4 h-4" />
								</button>
							</div>

							{/* File List */}
							{formData.files.length > 0 && (
								<div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
									<p className="flex-shrink-0 text-sm text-gray-600">Attached files:</p>
									<div className="flex items-center flex-wrap gap-2">
										{formData.files.map((file, index) => (
											<div key={index}
												className="flex items-center text-sm text-gray-700 bg-cyan-100 px-3 py-1 rounded"
											>
												{file.name}
												<button
													type="button"
													onClick={() => {
														const updatedFiles = formData.files.filter((_, i) => i !== index);
														setFormData({ ...formData, files: updatedFiles });
													}}
													className="ml-2 text-gray-500 hover:text-red-600"
												>
													&times;
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Feature Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
					{/* 100% Original */}
					<div className="">
						<div className="bg-yellow-100 border-2 border-orange-200 text-sm font-semibold flex justify-center items-center rounded-md mb-4 h-14 w-14">
							100%
						</div>
						<h3 className="font-semibold text-gray-800 text-sm">
							Original & Plagiarism-Free Work
						</h3>
					</div>

					{/* 24/7 Support */}
					<div className="">
						<div className="bg-yellow-100 border-2 border-orange-200 text-sm font-semibold flex justify-center items-center rounded-md mb-4 h-14 w-14">
							24/7
						</div>
						<h3 className="font-semibold text-gray-800 text-sm">
							Student Support Availability
						</h3>
					</div>

					{/* 3 Days Average */}
					<div className="">
						<div className="bg-yellow-100 border-2 border-orange-200 text-sm text-center font-semibold flex justify-center items-center rounded-md mb-4 h-14 w-14">
							3<br />Days
						</div>
						<h3 className="font-semibold text-gray-800 text-sm">
							Average Delivery Turnaround
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;