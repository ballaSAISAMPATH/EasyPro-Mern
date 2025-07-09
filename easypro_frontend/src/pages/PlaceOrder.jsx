import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderTypeSelection from '../components/Orders/OrderTypeSelection';
import WritingOrderFlow from '../components/Orders/WritingOrderFlow';
import EditingOrderFlow from '../components/Orders/EditingOrderFlow';
import TechnicalOrderFlow from '../components/Orders/TechnicalOrderFlow';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getDaysRemaining = (deadline) => {
	if (!deadline) return 0;
	const deadlineDate = new Date(deadline);
	const today = new Date();
	const diffTime = deadlineDate - today;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const PlaceOrder = () => {
	const location = useLocation();
	const [currentStep, setCurrentStep] = useState(0);
	const [orderData, setOrderData] = useState({
		type: '',
		paperType: '',
		subject: '',
		otherSubject: '',
		otherPaperType: '',
		otherSoftware: '',
		instructions: '',
		files: [],
		pageCount: 1,
		slides: 0,
		showSlides: false,
		deadline: '',
		software: 'Not applicable',
		showSoftware: false,
		selectedWriter: null,
		availableWriters: []
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateOrderData = (newData) => {
		setOrderData(prev => ({ ...prev, ...newData }));
	};

	const nextStep = () => {
		if (currentStep < 3) {
			setCurrentStep(prev => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(prev => prev - 1);
		}
	};

	const getDefaultDeadline = (days = 10) => {
		const date = new Date();
		date.setDate(date.getDate() + days);

		// Get local ISO string for datetime-local input
		const pad = (n) => String(n).padStart(2, '0');
		const yyyy = date.getFullYear();
		const mm = pad(date.getMonth() + 1); // Months start at 0
		const dd = pad(date.getDate());
		const hh = pad(date.getHours());
		const min = pad(date.getMinutes());

		return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
	};


	const setQuickDeadline = (days) => {
		updateOrderData({ deadline: getDefaultDeadline(days) });
	};

	const submitOrder = async () => {
		setIsSubmitting(true);

		try {
			const requestBody = buildRequestData(orderData);

			const response = await axios.post(`${API_URL}/order`, requestBody, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'multipart/form-data'
				}
			});

			return response.data;
		} catch (error) {
			console.error('Error submitting order:', error);
			toast.error('Failed to submit order. Please try again.');
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const buildRequestData = (data) => {
		const formData = new FormData();

		// Base fields
		formData.append('type', data.type);
		formData.append('subject', data.subject === 'Other' ? data.otherSubject : data.subject);
		formData.append('deadline', data.deadline);
		formData.append('instruction', data.instructions || '');

		// Files (append each one under same field name)
		if (data.files && data.files.length > 0) {
			data.files.forEach((file) => {
				formData.append('files', file); // key must match multer field
			});
		}

		// Type-specific fields
		switch (data.type) {
			case 'writing':
				formData.append('paperType', data.paperType === 'Other' ? data.otherPaperType : data.paperType);
				formData.append('pageCount', data.pageCount);
				if (data.showSlides) formData.append('slides', data.slides);
				break;

			case 'editing':
				formData.append('pageCount', data.pageCount);
				break;

			case 'technical':
				const software = data.showSoftware
					? (data.software === 'Other' ? data.otherSoftware : data.software)
					: 'Not applicable';
				formData.append('software', software);
				if (data.selectedWriter?._id) formData.append('selectedWriter', data.selectedWriter._id);
				break;

			default:
				break;
		}

		return formData;
	};

	const renderOrderFlow = () => {
		if (!orderData.type || currentStep === 0) {
			return <OrderTypeSelection updateOrderData={updateOrderData} onNext={nextStep} />;
		}

		switch (orderData.type) {
			case 'writing':
				return (
					<WritingOrderFlow
						currentStep={currentStep}
						orderData={orderData}
						updateOrderData={updateOrderData}
						nextStep={nextStep}
						prevStep={prevStep}
						getDefaultDeadline={getDefaultDeadline}
						setQuickDeadline={setQuickDeadline}
						getDaysRemaining={getDaysRemaining}
						submitOrder={submitOrder}
						isSubmitting={isSubmitting}
					/>
				);
			case 'editing':
				return (
					<EditingOrderFlow
						currentStep={currentStep}
						orderData={orderData}
						updateOrderData={updateOrderData}
						nextStep={nextStep}
						prevStep={prevStep}
						getDefaultDeadline={getDefaultDeadline}
						setQuickDeadline={setQuickDeadline}
						getDaysRemaining={getDaysRemaining}
						submitOrder={submitOrder}
						isSubmitting={isSubmitting}
					/>
				);
			case 'technical':
				return (
					<TechnicalOrderFlow
						currentStep={currentStep}
						orderData={orderData}
						updateOrderData={updateOrderData}
						nextStep={nextStep}
						prevStep={prevStep}
						getDefaultDeadline={getDefaultDeadline}
						setQuickDeadline={setQuickDeadline}
						getDaysRemaining={getDaysRemaining}
						submitOrder={submitOrder}
						isSubmitting={isSubmitting}
					/>
				);
			default:
				return <OrderTypeSelection updateOrderData={updateOrderData} onNext={nextStep} />;
		}
	};

	useEffect(() => {		
		if (currentStep === 1 && location.state) {
			const { instructions = '', files = [] } = location.state;
			setOrderData((prev) => ({
				...prev,
				instructions,
				files
			}));
		}
	}, [currentStep, location.state]);

	return (
		<div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg min-h-[600px]">
			{orderData.type && currentStep > 0 && (
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-600">Step {currentStep} of {orderData.type === 'editing' ? 2 : 3}</span>
						<span className="text-sm text-gray-500 capitalize">{orderData.type} Order</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${(currentStep / (orderData.type === 'editing' ? 2 : 3)) * 100}%` }}
						></div>
					</div>
				</div>
			)}
			{renderOrderFlow()}
		</div>
	);
};

export default PlaceOrder;