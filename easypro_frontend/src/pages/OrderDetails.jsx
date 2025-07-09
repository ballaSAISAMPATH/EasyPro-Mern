import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
	Calendar,
	FileText,
	Edit,
	XCircle,
	Clock,
	Star,
	Mail,
	Eye,
	UserPlus,
	ChevronLeft
} from 'lucide-react';
import NavBar from '../components/NavBar';
import ReviewModal from '../components/Orders/ReviewModal';
import ReasonModal from '../components/Orders/ReasonModal';
import EditOrderModal from '../components/Orders/EditOrderModal';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrderDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showReasonModal, setShowReasonModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [reviewData, setReviewData] = useState({
		followingInstructions: 0,
		grammar: 0,
		responseSpeed: 0,
		formatting: 0,
		other: 0,
		description: '',
		writer: '',
		order: ''
	});

	const fetchOrder = async () => {
		try {
			const response = await axios.get(`${API_URL}/order/${id}`, {
				headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
			});
			setOrder(response.data.data);
		} catch (err) {
			setError('Failed to fetch order details');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, [id]);

	const handleOrderUpdate = (updatedOrder) => {
		setOrder(updatedOrder);
	};

	if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
	if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
	if (!order) return <div className="text-center mt-10">Order not found</div>;

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const renderStatus = () => {
		const status = order.status.state;
		switch (status) {
			case 'assigned':
			case 'pending':
			case 'completed':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Writer Details</h3>
						<div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-3">
							<div className="flex items-center gap-3">
								<div className="relative flex-shrink-0">
									<img
										src={order.writer?.profilePic}
										alt={order.writer?.fullName}
										className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
									/>
									{order.writer?.ordersLeft === 0 ? (
										<div className="absolute -bottom-0.5 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-white"></div>
									) : !order.writer.availableOn || new Date(order.writer.availableOn) > new Date() ? (
										<div className="absolute -bottom-0.5 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
									) : null}
								</div>
								<div>
									<div className="font-medium text-gray-900">{order.writer?.fullName}</div>
									<div className="text-sm text-gray-600 flex items-center gap-1">
										<Mail className="w-3 h-3" />
										{order.writer?.email}
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="font-semibold">Skills</h4>
								<div className="flex flex-wrap gap-1 text-gray-500">
									{order.writer?.skills &&
										order.writer.skills?.slice(0, 3).map((skill, index) => (
											<span
												key={index}
												className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
											>
												{skill.skill}
											</span>
										))}
									{order.writer.skills.length > 3 && (
										<span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
											+{order.writer.skills.length - 3}
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-1 mt-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${i < order.writer.rating?.avgRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
										/>
									))}
									<span className="text-xs text-gray-500 ml-1">({order.writer?.rating?.count || 0})</span>
								</div>
								{order.review ?
									<button
										onClick={() => {
											setShowReviewModal(true)
											setReviewData(order?.review);
										}}
										className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md"
									>
										<Eye className="w-4 h-4" />
										View Review
									</button>
									:
									<button
										disabled={status !== 'completed'}
										onClick={() => setShowReviewModal(true)}
										className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg
										${status === 'completed' ?
												"text-green-700 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
												: "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-not-allowed"
											}
											transition-all duration-200 shadow-sm hover:shadow-md`}
									>
										<Star className="w-4 h-4" />
										Leave Review
									</button>
								}
							</div>
						</div>
					</div>
				);
			case 'unassigned':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Writer Details</h3>
						<div className="flex items-center text-amber-500">
							<UserPlus className="mr-2" size={20} />
							Writer to be assigned
						</div>
					</div>
				);
			case 'cancelled':
				return (
					<div className="flex items-center text-red-600 mt-6">
						<XCircle className="mr-2" size={20} />
						Cancelled
						<button
							onClick={() => setShowReasonModal(true)}
							className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
						>
							View Reason
						</button>
					</div>
				);
			case 'expired':
				return (
					<div className="flex items-center text-orange-600 mt-6">
						<Clock className="mr-2" size={20} />
						Expired on {formatDate(order.deadline)}
					</div>
				);
			default:
				return null;
		}
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
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-6">
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
			</div >
		);
	};

	const handleSubmitReview = async () => {
		try {
			const reviewPayload = {
				...reviewData,
				writer: order.writer?._id,
				order: order._id
			};

			const response = await axios.post(
				`${API_URL}/review`,
				reviewPayload,
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			if (response.data.success) {
				toast.success("Review Submitted")
				setShowReviewModal(false)
				setReviewData({
					followingInstructions: 0,
					grammar: 0,
					responseSpeed: 0,
					formatting: 0,
					other: 0,
					description: '',
					writer: '',
					order: ''
				});
			}
		} catch (err) {
			toast.error(err.response?.data?.message || 'Failed to submit review')
			console.error('Error submitting review:', err);
		}
	};

	return (
		<>
			<NavBar />
			<div className="container mx-auto px-6 md:px-20 pt-6 pb-20">
				<button
					onClick={() => navigate(-1)}
					className='flex items-center gap-1 bg-gray-300 rounded-md py-2 pr-3 pl-2 mb-6 text-xs md:text-base'
				>
					<ChevronLeft size={18} /> Back
				</button>
				<div className="space-y-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-lg md:text-2xl font-bold text-gray-800">
								{order.type.charAt(0).toUpperCase() + order.type.slice(1)} Order
							</h1>
							<p className="text-gray-600 text-sm">Order ID: {order._id}</p>
						</div>
						<div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
							{order.status.state.charAt(0).toUpperCase() + order.status.state.slice(1)}
						</div>
					</div>

					<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md overflow-hidden">
						<div className="p-4">
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

					{renderStatus()}

					{(order.type === 'writing' || order.type === 'editing') &&
						order.status.state === 'unassigned' && (
							<div className="mt-6">
								<button
									onClick={() => setShowEditModal(true)}
									className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
								>
									<Edit className="mr-2" size={18} />
									Edit Order
								</button>
							</div>
						)}

					{order.responses && order.responses.length > 0 && (
						<div className="mt-8">
							<h2 className="text-lg font-semibold mb-4">Order Responses</h2>
							<div className="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
								{order.responses.map((response, index) => (
									<div key={index} className="bg-gray-100 p-4 rounded-lg shadow-xs">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<FileText />
												<div>
													<p className="font-medium capitalize text-gray-800">{response.title}</p>
													<p className="text-xs text-gray-600">
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
						</div>
					)}
				</div>

				<ReviewModal
					isOpen={showReviewModal}
					order={order}
					reviewData={reviewData}
					setReviewData={setReviewData}
					handleSubmitReview={handleSubmitReview}
					onClose={() => setShowReviewModal(false)}
				/>

				{showReasonModal && (
					<ReasonModal
						reason={order.status.reason}
						onClose={() => setShowReasonModal(false)}
					/>
				)}

				{showEditModal && (
					<EditOrderModal
						order={order}
						onClose={() => setShowEditModal(false)}
						onSave={handleOrderUpdate}
					/>
				)}
			</div>
		</>
	);
};

export default OrderDetails;