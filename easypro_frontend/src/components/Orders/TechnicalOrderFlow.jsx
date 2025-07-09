import { ChevronLeft, ChevronRight, Code, Upload, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TechnicalOrderFlow = ({
	currentStep,
	orderData,
	updateOrderData,
	nextStep,
	prevStep,
	getDefaultDeadline,
	setQuickDeadline,
	getDaysRemaining,
	submitOrder,
	isSubmitting
}) => {
	const [availableWriters, setAvailableWriters] = useState([]);
	const [isLoadingWriters, setIsLoadingWriters] = useState(false);

	const navigate = useNavigate();
	const subjects = [
		'Mathematics', 'Statistics', 'Physics', 'Chemistry', 'Biology',
		'Computer Science', 'Engineering', 'Data Analysis', 'Accounting', 'Finance',
		'Economics', 'Business Analytics', 'Machine Learning', 'Other'
	];

	const softwareOptions = [
		'Not applicable', 'Python', 'R', 'MATLAB', 'Excel', 'SPSS', 'SAS', 'Stata', 'Java',
		'C++', 'JavaScript', 'SQL', 'Tableau', 'Power BI', 'AutoCAD', 'Other'
	];

	const toISTDatetimeLocal = (utcDateStr) => {
		const utcDate = new Date(utcDateStr);
		const istOffset = 5.5 * 60 * 60000; // 5.5 hours in milliseconds
		const istDate = new Date(utcDate.getTime() + istOffset);

		const year = istDate.getFullYear();
		const month = String(istDate.getMonth() + 1).padStart(2, '0');
		const day = String(istDate.getDate()).padStart(2, '0');
		const hours = String(istDate.getHours()).padStart(2, '0');
		const minutes = String(istDate.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	const fetchWriters = async (subject, deadline) => {
		try {
			setIsLoadingWriters(true);
			const response = await axios.get(`${API_URL}/writer`, {
				params: { subject, deadline },
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			setAvailableWriters(response.data.data);
			console.log('Available writers:', response.data);

		} catch (error) {
			console.error('Error fetching writers:', error);
			setAvailableWriters([]);
			toast.error('Failed to load writers. Please try again.');
		} finally {
			setIsLoadingWriters(false);
		}
	};

	useEffect(() => {
		if (currentStep === 2 && orderData.deadline && orderData.subject) {
			if (orderData.subject === 'Other' && orderData.otherSubject) {
				fetchWriters(orderData.otherSubject, orderData.deadline);
			} else {
				fetchWriters(orderData.subject, orderData.deadline);
			}
		}
	}, [currentStep, orderData.deadline, orderData.subject, orderData.otherSubject]);

	const handleSubjectChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			subject: value,
			otherSubject: value === 'Other' ? orderData.otherSubject : ''
		});
	};

	const handleSoftwareChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			software: value,
			otherSoftware: value === 'Other' ? orderData.otherSoftware : ''
		});
	};

	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files);
		updateOrderData({ files: [...orderData.files, ...files] });
	};

	const removeFile = (index) => {
		const newFiles = orderData.files.filter((_, i) => i !== index);
		updateOrderData({ files: newFiles });
	};

	const toggleSoftware = () => {
		if (orderData.showSoftware) {
			updateOrderData({ showSoftware: false, software: 'Not applicable', otherSoftware: '' });
		} else {
			updateOrderData({ showSoftware: true, software: 'Python' });
		}
	};

	const handleSubmit = async () => {
		try {
			const response = await submitOrder();
			toast.success('Order submitted successfully!');
			console.log('Order submitted:', response);
			navigate('/user/orders');
		} catch (error) {
			console.error('Error submitting order:', error);
			toast.error('Failed to submit order. Please try again.');
		}
	};

	const getSubjectDisplay = () => {
		return orderData.subject === 'Other' ? orderData.otherSubject : orderData.subject;
	};

	const getSoftwareDisplay = () => {
		if (!orderData.showSoftware) return 'Not applicable';
		return orderData.software === 'Other' ? orderData.otherSoftware : orderData.software;
	};

	useEffect(() => {
		if (currentStep === 2 && !orderData.deadline) {
			updateOrderData({ deadline: getDefaultDeadline() });
		}
	}, [currentStep]);

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Details</h2>
							<p className="text-gray-600">Select subject, provide instructions, and upload files</p>
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
								<select
									value={orderData.subject}
									onChange={handleSubjectChange}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									<option value="">Select subject</option>
									{subjects.map(subject => (
										<option key={subject} value={subject}>{subject}</option>
									))}
								</select>
								{orderData.subject === 'Other' && (
									<div className="mt-2">
										<input
											type="text"
											value={orderData.otherSubject}
											onChange={(e) => updateOrderData({ otherSubject: e.target.value })}
											placeholder="Please specify subject"
											className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
								<textarea
									value={orderData.instructions}
									onChange={(e) => updateOrderData({ instructions: e.target.value })}
									placeholder="Please provide detailed instructions for your technical task..."
									className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Upload Files (Optional)</label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
									<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
									<label className="cursor-pointer">
										<span className="text-purple-600 hover:text-purple-500 font-medium">Click to upload</span>
										<input
											type="file"
											multiple
											onChange={handleFileUpload}
											className="hidden"
											accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.py,.r,.m"
										/>
									</label>
								</div>
								{orderData.files.length > 0 && (
									<div className="mt-3 space-y-2">
										{orderData.files.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
												<span className="text-sm">{file.name}</span>
												<button onClick={() => removeFile(index)} className="text-red-500 text-sm">Remove</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<Code size={20} className="text-purple-600" />
										<span className="font-medium">Add Software</span>
									</div>
									<button
										onClick={toggleSoftware}
										className={`px-3 py-1 rounded text-sm ${orderData.showSoftware ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
									>
										{orderData.showSoftware ? 'Remove' : 'Add'}
									</button>
								</div>
								{orderData.showSoftware && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Software/Tool</label>
										<select
											value={orderData.software}
											onChange={handleSoftwareChange}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										>
											{softwareOptions.map(software => (
												<option key={software} value={software}>{software}</option>
											))}
										</select>
										{orderData.software === 'Other' && (
											<div className="mt-2">
												<input
													type="text"
													value={orderData.otherSoftware}
													onChange={(e) => updateOrderData({ otherSoftware: e.target.value })}
													placeholder="Please specify software"
													className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
												/>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-between pt-4 text-sm md:text-base">
							<button onClick={prevStep} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
								<ChevronLeft size={20} className="mr-1" />
								Back
							</button>
							<button
								onClick={nextStep}
								disabled={!orderData.subject ||
									(orderData.subject === 'Other' && !orderData.otherSubject) ||
									!orderData.instructions.trim() ||
									(orderData.showSoftware && orderData.software === 'Other' && !orderData.otherSoftware)}
								className="flex items-center pl-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
								<ChevronRight size={20} className="ml-1" />
							</button>
						</div>
					</div>
				);
			case 2:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Set Deadline & Select Writer</h2>
							<p className="text-gray-600">When do you need your technical work completed?</p>
						</div>

						<div className="max-w-sm mx-auto space-y-4">
							<div className="flex space-x-2">
								<button
									onClick={() => setQuickDeadline(3)}
									className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
								>
									3 Days
								</button>
								<button
									onClick={() => setQuickDeadline(7)}
									className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
								>
									1 Week
								</button>
								<button
									onClick={() => setQuickDeadline(14)}
									className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
								>
									2 Weeks
								</button>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
								<input
									type="datetime-local"
									value={orderData.deadline}
									onChange={(e) => updateOrderData({ deadline: e.target.value })}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
								{orderData.deadline && (
									<p className="text-sm text-gray-500 mt-1">
										{getDaysRemaining(orderData.deadline)} days remaining
									</p>
								)}
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-medium text-gray-900">Available Writers</h3>

							{isLoadingWriters ? (
								<div className="text-center py-8 text-gray-500">
									<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
									<p className="mt-2">Loading available writers...</p>
								</div>
							) : availableWriters.length > 0 ? (
								<div className="space-y-3">
									{availableWriters.map((writer) => (
										<div
											key={writer._id}
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${orderData.selectedWriter?._id === writer._id
												? 'border-purple-500 bg-purple-50'
												: 'border-gray-200 hover:border-gray-300'
												}`}
											onClick={() => updateOrderData({ selectedWriter: writer })}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<img
														src={writer.profilePic}
														className='w-12 h-12 rounded-full object-cover'
														alt="Writer profile"
													/>
													<div>
														<h3 className="font-semibold text-gray-900">{writer.fullName}</h3>
														<div className="flex items-center space-x-2 text-sm text-gray-600">
															<div className="flex items-center">
																<Star size={14} className="text-yellow-400 fill-current" />
																<span className="ml-1">{writer.rating?.avgRating > 0 ? `${writer.rating?.avgRating} (${writer.rating?.count})` : 'New'}</span>
															</div>
															<span>•</span>
															<span>Orders Left: {writer.ordersLeft}/{writer.maxOrders}</span>
														</div>
														<div className="flex flex-wrap gap-1 mt-1">
															{writer.skills.slice(0, 3).map((skill, index) => (
																<span
																	key={index}
																	className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
																>
																	{skill.skill}
																</span>
															))}
															{writer.skills.length > 3 && (
																<span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
																	+{writer.skills.length - 3}
																</span>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									<p>No writers available for the selected criteria.</p>
									<p className="text-sm mt-1">Try adjusting your deadline or subject.</p>
								</div>
							)}
						</div>

						<div className="flex justify-between pt-4 text-sm md:text-base">
							<button onClick={prevStep} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
								<ChevronLeft size={20} className="mr-1" />
								Back
							</button>
							<button
								onClick={nextStep}
								disabled={!orderData.selectedWriter}
								className="flex items-center pl-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
								<ChevronRight size={20} className="ml-1" />
							</button>
						</div>
					</div>
				);
			case 3:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
							<p className="text-gray-600">Review your technical order details</p>
						</div>

						<div className="bg-gray-50 p-4 rounded-lg">
							<div className="space-y-4">
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Type:</span>
										<span className="font-medium">Technical</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Subject:</span>
										<span className="font-medium">{getSubjectDisplay()}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Software:</span>
										<span className="font-medium">{getSoftwareDisplay()}</span>
									</div>
									{orderData.files.length > 0 && (
										<div className="flex justify-between">
											<span className="text-gray-600">Files:</span>
											<span className="font-medium">{orderData.files.length} file(s)</span>
										</div>
									)}
									<div className="flex justify-between">
										<span className="text-gray-600">Assigned Writer:</span>
										<span className="font-medium">{orderData.selectedWriter?.fullName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Deadline:</span>
										<span className="font-medium">
											{new Date(toISTDatetimeLocal(orderData.deadline)).toLocaleString('en-GB', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												hour12: true
											})}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Days:</span>
										<span className="font-medium">
											{getDaysRemaining(orderData.deadline)} days
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-between pt-4 text-sm md:text-base">
							<button onClick={prevStep} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
								<ChevronLeft size={20} className="mr-1" />
								Back
							</button>
							<button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
							>
								{isSubmitting ? 'Submitting...' : 'Submit Order'}
								{!isSubmitting && <ChevronRight size={20} className="ml-1" />}
							</button>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return renderStep();
};

export default TechnicalOrderFlow;