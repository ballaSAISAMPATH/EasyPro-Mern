import { ChevronLeft, ChevronRight, Upload, Star, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Counter from './Counter';

const EditingOrderFlow = ({
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
	const navigate = useNavigate();

	const subjects = [
		'English', 'Literature', 'History', 'Psychology', 'Sociology', 'Philosophy',
		'Business', 'Economics', 'Marketing', 'Finance', 'Management',
		'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics',
		'Computer Science', 'Engineering', 'Medicine', 'Nursing', 'Law', 'Other'
	];

	const handleSubjectChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			subject: value,
			otherSubject: value === 'Other' ? orderData.otherSubject : ''
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
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Editing Details</h2>
							<p className="text-gray-600">Select subject, upload files, and provide instructions</p>
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
								<select
									value={orderData.subject}
									onChange={handleSubjectChange}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
											className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Upload Files *</label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
									<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
									<label className="cursor-pointer">
										<span className="text-green-600 hover:text-green-500 font-medium">Click to upload files</span>
										<input
											type="file"
											multiple
											onChange={handleFileUpload}
											className="hidden"
											accept=".pdf,.doc,.docx,.txt,.rtf"
										/>
									</label>
									<p className="text-xs text-gray-500 mt-1">Required: Upload files that need editing</p>
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

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
								<textarea
									value={orderData.instructions}
									onChange={(e) => updateOrderData({ instructions: e.target.value })}
									placeholder="Please provide editing instructions..."
									className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
								/>
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
									orderData.files.length === 0 ||
									!orderData.instructions.trim()}
								className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h2>
							<p className="text-gray-600">Specify page count and set deadline</p>
						</div>

						<div className="space-y-6">
							<div className="flex items-center justify-center">
								<div className="p-4 bg-gray-50 rounded-lg w-full max-w-md flex flex-col md:flex-row justify-between items-center gap-5">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Pages to Edit</label>
										<p className="text-xs text-gray-500">Double-spaced pages</p>
									</div>
									<Counter
										value={orderData.pageCount}
										onChange={(value) => updateOrderData({ pageCount: value })}
										min={1}
										label="pages"
									/>
								</div>
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
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
									/>
									{orderData.deadline && (
										<p className="text-sm text-gray-500 mt-1">
											{getDaysRemaining(orderData.deadline)} days remaining
										</p>
									)}
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Type:</span>
										<span className="font-medium">Editing</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Subject:</span>
										<span className="font-medium">{getSubjectDisplay()}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Pages:</span>
										<span className="font-medium">{orderData.pageCount}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Files:</span>
										<span className="font-medium">{orderData.files.length} file(s)</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Deadline:</span>
										<span className="font-medium">
											{new Date(orderData.deadline).toLocaleString('en-GB', {
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

export default EditingOrderFlow;