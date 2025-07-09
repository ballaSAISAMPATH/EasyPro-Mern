import { useState, useEffect } from 'react';
import axios from 'axios';
import { AssignWriterModal, ViewReviewModal, ViewReasonModal } from './OrderModals';
import { ChevronLeft, ChevronRight, Eye, Files, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrderTable = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
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
	const [limit] = useState(10);

	// Modal states
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showReasonModal, setShowReasonModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [writers, setWriters] = useState([]);

	useEffect(() => {
		fetchOrders();
	}, [pagination.currentPage, filters]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/order/admin/all`, {
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

			setOrders(response.data.data.orders);
			setPagination(response.data.data.pagination);
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			setLoading(false);
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

	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= pagination.totalPages) {
			setPagination(prev => ({ ...prev, currentPage: newPage }));
		}
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	const handleAssignClick = async (order) => {
		setSelectedOrder(order);
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
		} catch (error) {
			console.error('Error fetching writers:', error);
		}
	};

	const handleReviewClick = (order) => {
		setSelectedOrder(order);
		setShowReviewModal(true);
	};

	const handleReasonClick = (order) => {
		setSelectedOrder(order);
		setShowReasonModal(true);
	};

	const handleAssignWriter = async (writerId) => {
		try {
			await axios.patch(`${API_URL}/order/admin/${selectedOrder._id}/assign`, {
				writerId
			}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			setShowAssignModal(false);
			fetchOrders();
		} catch (error) {
			console.error('Error assigning writer:', error);
		}
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
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	return (
		<div className="bg-white px-6 md:px-20 py-10">
			<h1 className="text-2xl font-bold mb-6">Order Management</h1>

			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
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

			{/* Table */}
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
				</div>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Writer</th>
									<th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
									<th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{orders.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center">
											<div className="flex flex-col items-center justify-center space-y-3">
												<Files className="w-12 h-12 text-gray-400" />
												<p className="text-gray-500 text-lg font-medium">No orders found</p>
												<p className="text-gray-400 text-sm">User orders will appear here once they place the order</p>
											</div>
										</td>
									</tr>
								) : <>
									{orders.map((order) => (
										<tr key={order._id}>
											<td className="space-y-1 px-6 py-4 whitespace-nowrap text-gray-500">
												<p>{order.subject}</p>
												<p className='text-xs'>#ID_{order._id}</p>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">{order.type}</td>
											<td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.writer?.fullName || "Not Assigned"}</td>
											<td className="px-6 py-4 whitespace-nowrap text-gray-500">
												{formatDate(order.deadline)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{getStatusBadge(order.status.state)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap font-medium text-sm">
												<div className="flex justify-center space-x-2">
													{/* View button - always shown */}
													<button
														onClick={() => navigate(`/admin/order/${order._id}`)}
														className="flex items-center gap-1 p-2 rounded-md border border-sky-500 text-white bg-sky-400 hover:bg-sky-600"
													>
														<Eye className="w-4 h-4" />
														View
													</button>

													{/* Conditional buttons based on status */}
													{order.status.state === 'unassigned' && (
														<button
															onClick={() => handleAssignClick(order)}
															className="flex items-center gap-1 p-2 rounded-md border border-green-500 text-green-500 hover:text-white hover:bg-green-400"
														>
															<UserPlus className="w-4 h-4" />
															Assign
														</button>
													)}

													{order.status.state === 'completed' && order.review && (
														<button
															onClick={() => handleReviewClick(order)}
															className="text-purple-600 hover:text-purple-900"
														>
															View Review
														</button>
													)}

													{order.status.state === 'cancelled' && (
														<button
															onClick={() => handleReasonClick(order)}
															className="text-red-600 hover:text-red-900"
														>
															View Reason
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</>}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between mt-4">
						<div>
							<p className="text-xs md:text-sm text-gray-700">
								Showing <span className="font-medium">{(pagination.currentPage - 1) * limit + 1}</span> to{' '}
								<span className="font-medium">{Math.min(pagination.currentPage * limit, pagination.totalOrders)}</span> of{' '}
								<span className="font-medium">{pagination.totalOrders}</span> orders
							</p>
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={!pagination.hasPrev}
								className={`flex items-center gap-2 p-2 border rounded-md ${pagination.hasPrev ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 cursor-not-allowed'}`}
							>
								<ChevronLeft size={18} />
								<span className='hidden md:block'>Previous</span>
							</button>
							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={!pagination.hasNext}
								className={`flex items-center gap-2 p-2 border rounded-md ${pagination.hasNext ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 cursor-not-allowed'}`}
							>
								<span className='hidden md:block'>Next</span>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>
				</>
			)}

			{/* Modals */}
			<AssignWriterModal
				isOpen={showAssignModal}
				onClose={() => setShowAssignModal(false)}
				order={selectedOrder}
				writers={writers}
				onAssign={handleAssignWriter}
			/>

			<ViewReviewModal
				isOpen={showReviewModal}
				onClose={() => setShowReviewModal(false)}
				review={selectedOrder?.review}
			/>

			<ViewReasonModal
				isOpen={showReasonModal}
				onClose={() => setShowReasonModal(false)}
				reason={selectedOrder?.status?.reason}
			/>
		</div>
	);
};

export default OrderTable;