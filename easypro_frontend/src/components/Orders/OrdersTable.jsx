import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Eye,
	X,
	Star,
	RotateCcw,
	RefreshCw,
	Calendar,
	User,
	FileText,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Files
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderModals from './OrderModals';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrdersTable = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalOrders: 0,
		hasNext: false,
		hasPrev: false
	});
	const [filters, setFilters] = useState({
		status: '',
		type: ''
	});
	const limit = 10;

	// Modal states
	const [modalState, setModalState] = useState({
		showConfirmCancel: false,
		showViewWriter: false,
		showReview: false,
		showRepeatOrder: false,
		showRevokeOrder: false
	});

	// Selected order for actions
	const [selectedOrder, setSelectedOrder] = useState(null);

	// Form states
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
	const [newData, setNewData] = useState({
		deadline: '',
		writer: '',
		status: { state: '' }
	});

	useEffect(() => {
		fetchOrders();
	}, [pagination.currentPage, filters]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/order`, {
				params: {
					status: filters.status,
					type: filters.type,
					page: pagination.currentPage,
					limit: limit
				},
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			if (response.data.success) {
				setOrders(response.data.data.orders);
				setPagination(response.data.data.pagination);
			}
		} catch (err) {
			setError('Failed to fetch orders');
			console.error('Error fetching orders:', err);
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'unassigned':
				return <AlertCircle className="w-4 h-4 text-yellow-500" />;
			case 'assigned':
			case 'pending':
				return <Clock className="w-4 h-4 text-blue-500" />;
			case 'completed':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'cancelled':
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'unassigned':
				return 'bg-yellow-100 text-yellow-800';
			case 'assigned':
			case 'pending':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

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

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	const handleCancelOrder = async (data) => {
		try {
			const response = await axios.patch(
				`${API_URL}/order/${selectedOrder._id}`,
				data,
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			);

			if (response.data.success) {
				setModalState({ ...modalState, showConfirmCancel: false });
				setSelectedOrder(null);
				fetchOrders();
			}
		} catch (err) {
			console.error('Error cancelling order:', err);
		}
	};

	const handleSubmitReview = async () => {
		try {
			const reviewPayload = {
				...reviewData,
				writer: selectedOrder.writer?._id,
				order: selectedOrder._id
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
				setModalState({ ...modalState, showReview: false });
				setSelectedOrder(null);
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
				fetchOrders();
			}
		} catch (err) {
			console.error('Error submitting review:', err);
		}
	};

	const handleOrderAction = async () => {
		try {
			let payload = { deadline: newData.deadline };

			// For technical orders, include writer and set status to pending
			if (selectedOrder.type === 'technical') {
				payload.writer = newData.writer;
				payload.status = { state: 'pending' };
			} else {
				// For writing and editing orders, set status to unassigned
				payload.status = { state: 'unassigned' };
			}

			const response = await axios.patch(
				`${API_URL}/order/${selectedOrder._id}`,
				payload,
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			if (response.data.success) {
				// Close the appropriate modal
				const newModalState = { ...modalState };
				if (modalState.showRepeatOrder) {
					newModalState.showRepeatOrder = false;
				} else if (modalState.showRevokeOrder) {
					newModalState.showRevokeOrder = false;
				}
				setModalState(newModalState);
				setSelectedOrder(null);
				setNewData({ deadline: '', writer: '', status: { state: '' } });
				fetchOrders();
			}
		} catch (err) {
			console.error('Error processing order:', err);
		}
	};

	const renderActions = (order) => {
		const status = order.status.state;

		switch (status) {
			case 'unassigned':
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showConfirmCancel: true });
						}}
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<X className="w-4 h-4" />
						Cancel
					</button>
				);
			case 'assigned':
			case 'pending':
				return (
					<div className="flex gap-3 justify-center">
						<button
							onClick={() => {
								setSelectedOrder(order);
								setModalState({ ...modalState, showViewWriter: true });
							}}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							<Eye className="w-4 h-4" />
							View Writer
						</button>
						<button
							onClick={() => {
								setSelectedOrder(order);
								setModalState({ ...modalState, showConfirmCancel: true });
							}}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							<X className="w-4 h-4" />
							Cancel
						</button>
					</div>
				);
			case 'completed':
				return (order.review ?
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showReview: true });
							setReviewData(order?.review);
						}}
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<Eye className="w-4 h-4" />
						View Review
					</button>
					:
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showReview: true });
						}}
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<Star className="w-4 h-4" />
						Leave Review
					</button>
				);
			case 'cancelled':
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showRepeatOrder: true });
						}}
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<RotateCcw className="w-4 h-4" />
						Repeat Order
					</button>
				);
			default:
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showRevokeOrder: true });
						}}
						className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<RefreshCw className="w-4 h-4" />
						Revoke Order
					</button>
				);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{error}</p>
				<button
					onClick={fetchOrders}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto p-4 md:px-20">
			<h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex flex-wrap gap-4">
						<div className="w-full md:w-auto">
							<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
							<select
								id="status"
								name="status"
								value={filters.status}
								onChange={handleFilterChange}
								className="w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
							>
								<option value="">All Statuses</option>
								<option value="assigned">Assigned</option>
								<option value="unassigned">Unassigned</option>
								<option value="pending">Pending</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
								<option value="expired">Expired</option>
							</select>
						</div>

						<div className="w-full md:w-auto">
							<label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
							<select
								id="type"
								name="type"
								value={filters.type}
								onChange={handleFilterChange}
								className="w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
							>
								<option value="">All Types</option>
								<option value="writing">Writing</option>
								<option value="editing">Editing</option>
								<option value="technical">Technical</option>
							</select>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order Details
								</th>
								<th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
									Deadline
								</th>
								<th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
									Writer
								</th>
								<th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{orders.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center space-y-3">
											<Files className="w-12 h-12 text-gray-400" />
											<p className="text-gray-500 text-lg font-medium">No orders found</p>
											<button
												className='bg-blue-600 hover:bg-blue-800 rounded-md py-2 px-3 text-white text-sm'
												onClick={() => navigate('/order')}
											>
												Place Order
											</button>
										</div>
									</td>
								</tr>
							) : <>
								{orders.map((order) => (
									<tr key={order._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 cursor-pointer"
											onClick={() => navigate(`/order/${order._id}`)}>
											<div className="flex items-start gap-3">
												<FileText className="w-5 h-5 text-gray-400 mt-0.5" />
												<div>
													<p className="text-sm font-medium text-gray-900 hover:underline">{order.subject}</p>
													<p className="text-sm text-gray-500">{order.type} • {order.paperType}</p>
													{order.pageCount && (
														<p className="text-xs text-gray-400">{order.pageCount} pages</p>
													)}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-center">
											<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status.state)}`}>
												{getStatusIcon(order.status.state)}
												{order.status.state}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<Calendar className="w-4 h-4 text-gray-400" />
												{formatDate(order.deadline)}
											</div>
										</td>
										<td className="px-6 py-4">
											{order.writer ? (
												<div className="flex items-center gap-1 text-sm text-gray-900">
													<User className="w-4 h-4 text-gray-400" />
													{order.writer.fullName}
												</div>
											) : (
												<span className="text-sm text-gray-400">Not assigned</span>
											)}
										</td>
										<td className="px-6 py-4 text-center">
											{renderActions(order)}
										</td>
									</tr>
								))}
							</>
							}
						</tbody>
					</table>
				</div>

				{pagination.totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
						<div className="text-sm text-gray-700">
							Showing {((pagination.currentPage - 1) * limit) + 1} to {Math.min(pagination.currentPage * limit, pagination.totalOrders)} of {pagination.totalOrders} orders
						</div>
						<div className="flex gap-2">
							<button
								onClick={() =>
									setPagination(prev => ({
										...prev,
										currentPage: Math.max(1, prev.currentPage - 1)
									}))
								}
								disabled={!pagination.hasPrev}
								className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() =>
									setPagination(prev => ({
										...prev,
										currentPage: prev.currentPage + 1
									}))
								}
								disabled={!pagination.hasNext}
								className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</div>
					</div>
				)}
			</div>

			<OrderModals
				modalState={modalState}
				setModalState={setModalState}
				selectedOrder={selectedOrder}
				setSelectedOrder={setSelectedOrder}
				newData={newData}
				setNewData={setNewData}
				reviewData={reviewData}
				setReviewData={setReviewData}
				handleCancelOrder={handleCancelOrder}
				handleSubmitReview={handleSubmitReview}
				handleOrderAction={handleOrderAction}
			/>
		</div>
	);
};

export default OrdersTable;