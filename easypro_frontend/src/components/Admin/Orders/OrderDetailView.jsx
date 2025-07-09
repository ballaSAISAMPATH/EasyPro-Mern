import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CircleAlert, Clock8, ClockFading, Eye, FileText, FileWarning, Star, TriangleAlert, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AssignWriterModal, ViewReviewModal, ViewReasonModal, ResponseSummaryModal } from './OrderModals';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrderDetailView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [files, setFiles] = useState([]);
	const [fileTitles, setFileTitles] = useState([]);
	const [uploading, setUploading] = useState(false);

	// Modal states
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showReasonModal, setShowReasonModal] = useState(false);
	const [showSummaryModal, setShowSummaryModal] = useState(false);
	const [writers, setWriters] = useState([]);

	const formatDate = (deadline) => {
		const dateUTC = new Date(deadline);

		const day = String(dateUTC.getDate()).padStart(2, '0');
		const month = String(dateUTC.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const year = dateUTC.getFullYear();

		let hours = dateUTC.getHours();
		const minutes = String(dateUTC.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12 || 12; // Convert to 12-hour format
		const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

		return `${day}/${month}/${year}, ${formattedTime}`;
	};

	const fetchOrder = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/order/${id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			setOrder(response.data.data);
		} catch (err) {
			toast.error(err.response?.data?.message || 'Failed to fetch order');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, [id]);

	const addFileInput = () => {
		setFiles([...files, null]);
		setFileTitles([...fileTitles, '']);
	};

	const handleFileTitleChange = (index, value) => {
		const updatedTitles = [...fileTitles];
		updatedTitles[index] = value;
		setFileTitles(updatedTitles);
	};

	const handleFileChange = (index, e) => {
		const newFiles = [...files];
		newFiles[index] = e.target.files[0];
		setFiles(newFiles);
	};

	const removeFileInput = (index) => {
		const newFiles = [...files];
		const newTitles = [...fileTitles];
		newFiles.splice(index, 1);
		newTitles.splice(index, 1);
		setFiles(newFiles);
		setFileTitles(newTitles);
	};

	const handleFilesUpload = async () => {
		if (files.length === 0 || files.some(file => !file)) return;

		try {
			setUploading(true);
			const formData = new FormData();

			files.forEach((file) => {
				formData.append('files', file);
			});

			formData.append('titles', fileTitles);

			const response = await axios.patch(
				`${API_URL}/order/admin/${id}/response`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data',
					}
				}
			);

			if (response.data.success) {
				toast.success(response.data.message || 'Files uploaded successfully');
			} else {
				toast.error("Failed to Upload");
			}

			fetchOrder();
			setFiles([]);
			setFileTitles([]);
		} catch (err) {
			console.error('Error uploading files:', err);
			toast.error(err.response?.data?.message || 'Failed to upload files');
		} finally {
			setUploading(false);
		}
	};

	const handleAssignClick = async () => {
		try {
			// Fetch writers based on order subject and deadline
			const response = await axios.get(`${API_URL}/writer`, {
				params: {
					subject: order.subject,
					deadline: order.deadline
				},
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			setWriters(response.data.data);
			setShowAssignModal(true);
		} catch (err) {
			console.error('Error fetching writers:', err);
		}
	};

	const handleAssignWriter = async (writerId) => {
		try {
			await axios.patch(`${API_URL}/order/admin/${order._id}/assign`, {
				writerId, deadline: order.deadline
			}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			// Refresh order data
			fetchOrder();
			setShowAssignModal(false);
		} catch (err) {
			console.error('Error assigning writer:', err);
		}
	};

	const handleSubmitResponse = async () => {
		try {
			await axios.patch(`${API_URL}/order/admin/${order._id}/submit`, {}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			// Refresh order data
			fetchOrder();
			setShowSummaryModal(false);
		} catch (err) {
			console.error('Error assigning writer:', err);
		}
	}

	const getTimeLeft = (deadline) => {
		if (!deadline) return "0 days";

		const now = new Date();
		const end = new Date(deadline);

		const diffMs = end - now;

		if (diffMs <= 0) return "0 days";

		const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(totalHours / 24);
		const hours = totalHours % 24;

		return hours > 0 ? `${days} days ${hours} hours left` : `${days} days left`;
	};

	const getStatusBadge = (status) => {
		const statusClasses = {
			assigned: 'bg-blue-100 text-blue-800',
			unassigned: 'bg-yellow-100 text-yellow-800',
			pending: 'bg-purple-100 text-purple-800',
			completed: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
			expired: 'bg-gray-100 text-gray-800'
		};

		return (
			<span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	const renderOrderDetails = () => {
		if (!order) return null;

		const details = {
			writing: [
				{ label: 'Paper Type', value: order.paperType || 'Not specified' },
				{ label: 'Page Count', value: order.pageCount },
				{ label: 'Slides', value: order.slides || 'Not specified' }
			],
			editing: [
				{ label: 'Page Count', value: order.pageCount }
			],
			technical: [
				{ label: 'Software', value: order.software || 'Not specified' },
				{ label: 'Assigned Writer', value: order.writer ? order.writer.fullName : 'Not assigned' }
			]
		};

		return (
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-6">
				<h3 className="font-semibold text-xl mb-4 text-gray-800">{order.type.charAt(0).toUpperCase() + order.type.slice(1)} Details</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{details[order.type].map((item, index) => (
						<div key={index} className="bg-white p-4 rounded-lg shadow-xs">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
							<p className="text-lg font-semibold text-gray-800 mt-1">{item.value}</p>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderAttachments = () => {
		if (!order.files || order.files.length === 0) return null;

		return (
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-6">
				<h3 className="font-semibold text-xl mb-4 text-gray-800">Attachments</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{order.files.map((file, index) => (
						<div key={index} className="bg-white p-3 rounded-lg shadow-xs flex justify-between items-center gap-3">
							<div className="bg-blue-50 p-2 rounded-lg">
								<FileText className="w-6 h-6 text-blue-500" />
							</div>
							<p className="text-gray-800">{file.split('/').pop()}</p>
							<a
								href={file}
								target="_blank"
								rel="noopener noreferrer"
								className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-1"
							>
								<Eye size={18} /> View
							</a>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderResponses = () => {
		return (
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-6">
				<h3 className="font-semibold text-xl mb-4 text-gray-800">Responses</h3>
				{(!order.responses || order.responses.length === 0) ?
					<div className="flex flex-col justify-center items-center gap-4 bg-white py-10">
						<FileWarning size={40} />
						No Responses Uploaded
					</div>
					:
					<div className="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
						{order.responses.map((response, index) => (
							<div key={index} className="bg-white p-4 rounded-lg shadow-xs">
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<FileText />
										<div>
											<p className="font-medium capitalize text-gray-800">{response.title}</p>
											<p className="text-xs text-gray-500">
												{formatDate(response.createdAt)}
											</p>
										</div>
									</div>
									<a
										href={response.url}
										target="_blank"
										rel="noopener noreferrer"
										className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-1"
									>
										<Eye size={18} /> View
									</a>
								</div>
							</div>
						))}
					</div>
				}
				{['assigned', 'pending'].includes(order?.status.state) &&
					<div className="space-y-4 mt-6">
						{files.map((_, index) => (
							<div key={index} className="bg-white p-4 rounded-lg shadow-xs">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
										<input
											type="text"
											value={fileTitles[index] || ''}
											onChange={(e) => handleFileTitleChange(index, e.target.value)}
											placeholder="Enter file title"
											className='w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border text-sm'
										/>
									</div>

									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-1">File</label>
										<div className="flex items-center">
											<input
												type="file"
												onChange={(e) => handleFileChange(index, e)}
												className="block w-full text-sm text-gray-500
                        file:mr-3 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-gray-100 file:text-gray-700
                        hover:file:bg-gray-200"
											/>
											<button
												onClick={() => removeFileInput(index)}
												className="ml-2 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
											>
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						))}

						<div className="flex flex-wrap gap-3">
							<button
								onClick={addFileInput}
								className="px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-600 hover:bg-indigo-50 shadow-sm transition-all duration-200 flex items-center"
							>
								<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								Add Response
							</button>

							<button
								onClick={handleFilesUpload}
								disabled={files.length === 0 || files.some(file => !file) || uploading}
								className={`px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 flex items-center ${files.length === 0 || files.some(file => !file) || uploading
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
									}`}
							>
								{uploading ? (
									<>
										<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Uploading...
									</>
								) : (
									<>
										<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
										</svg>
										Upload {files.length > 1 ? 'Files' : 'File'}
									</>
								)}
							</button>
						</div>
					</div>
				}
			</div>
		);
	};

	const renderActionButtons = () => {
		if (!order) return null;

		switch (order.status.state) {
			case 'unassigned':
				return (
					<button
						onClick={handleAssignClick}
						className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition-all duration-200 flex items-center"
					>
						<UserPlus className="w-5 h-5 mr-2" />
						Assign Writer
					</button>
				);
			case 'completed':
				return order.review ? (
					<button
						onClick={() => setShowReviewModal(true)}
						className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-md transition-all duration-200 flex items-center"
					>
						<Star className="w-5 h-5 mr-2" />
						View Review
					</button>
				) : (
					<div className="px-5 py-2.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-lg shadow-sm flex items-center">
						<Check className="w-5 h-5 mr-2" />
						Completed
					</div>
				);
			case 'cancelled':
				return (
					<button
						onClick={() => setShowReasonModal(true)}
						className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md transition-all duration-200 flex items-center"
					>
						<CircleAlert className="w-5 h-5 mr-2" />
						View Reason
					</button>
				);
			case 'expired':
				return (
					<div className="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg shadow-sm flex items-center">
						<ClockFading className="w-5 h-5 mr-2" />
						Expired on {new Date(order.deadline).toLocaleDateString()}
					</div>
				);
			case 'pending':
				return (
					<div className="px-5 py-2.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-lg shadow-sm flex items-center">
						<Clock8 className="w-5 h-5 mr-2" />
						{getTimeLeft(order.deadline)}
					</div>
				);
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-6 md:px-20 py-8">
				<div className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center">
					<TriangleAlert size={60} className='text-red-500' />
					<h3 className="mt-3 text-lg font-medium text-gray-900">Order not found</h3>
					<p className="mt-2 text-sm text-gray-500">The requested order could not be found.</p>
					<div className="mt-6">
						<button
							onClick={() => navigate(-1)}
							className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all duration-200"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-6 md:px-20 py-8">
			<button
				onClick={() => navigate(-1)}
				className='flex items-center gap-1 bg-gray-300 rounded-md py-2 pr-3 pl-2 mb-6'
			>
				<ChevronLeft size={18} /> Back
			</button>
			{/* Header Card */}
			<div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-xl overflow-hidden mb-6">
				<div className="p-6 md:p-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h1>
							<div className="flex items-center mt-2 space-x-4">
								<span className="capitalize text-indigo-100">{order.type}</span>
								<span className="text-indigo-200">•</span>
								<span>{getStatusBadge(order.status.state)}</span>
							</div>
						</div>
						<div className="mt-4 md:mt-0">
							{renderActionButtons()}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="space-y-6 flex flex-col">
				{/* Basic Info Card */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md overflow-hidden">
					<div className="p-6">
						<h2 className="font-semibold text-xl mb-4 text-gray-800">Basic Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-gray-500">Subject</p>
									<p className="text-lg font-semibold text-gray-800">{order.subject}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500">Deadline</p>
									<p className="text-lg font-semibold text-gray-800">
										{formatDate(order.deadline)}
									</p>
								</div>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-500">Instructions</p>
								<div className="mt-1 bg-white p-4 rounded-lg">
									<p className="whitespace-pre-wrap text-gray-800">
										{order.instruction || 'No instructions provided'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Type-specific details */}
				{renderOrderDetails()}

				{/* Attachments */}
				{renderAttachments()}

				{/* Responses (only for completed orders) */}
				{renderResponses()}

				{order?.status?.state !== 'completed' &&
					<button
						onClick={() => {
							if (order.responses.length > 0 && !order.responses.some(file => !file)) {
								setShowSummaryModal(true);
							}
						}}
						disabled={order.responses.length === 0 || order.responses.some(file => !file)}
						className={`self-center px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 flex items-center ${order.responses.length === 0 || order.responses.some(file => !file)
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'}`}
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
						</svg>
						Submit Order
					</button>
				}
			</div>

			{/* Modals */}
			<AssignWriterModal
				isOpen={showAssignModal}
				onClose={() => setShowAssignModal(false)}
				order={order}
				writers={writers}
				onAssign={handleAssignWriter}
			/>

			<ViewReviewModal
				isOpen={showReviewModal}
				onClose={() => setShowReviewModal(false)}
				review={order.review}
			/>

			<ViewReasonModal
				isOpen={showReasonModal}
				onClose={() => setShowReasonModal(false)}
				reason={order.status.reason}
			/>

			<ResponseSummaryModal
				isOpen={showSummaryModal}
				onClose={() => setShowSummaryModal(false)}
				onConfirm={handleSubmitResponse}
				responses={order.responses}
			/>
		</div>
	);
};

export default OrderDetailView;