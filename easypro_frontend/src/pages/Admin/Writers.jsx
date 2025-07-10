import { useEffect, useState } from 'react';
import {
	Plus,
	User,
	Mail,
	Star,
	Users,
	Trash2,
	UserPlus,
	Search,
	ArrowUpDown,
	Eye
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../../components/Admin/NavBar';
import HandleWriter from '../../components/Admin/Writers/HandleWriter';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Writers = () => {
	const [writers, setWriters] = useState([]);
	const [filteredWriters, setFilteredWriters] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [originalData, setOriginalData] = useState({});
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('fullName');
	const [sortOrder, setSortOrder] = useState('asc');
	const [filterBy, setFilterBy] = useState('all');
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		profilePic: '',
		skills: [{ skill: '', experience: 0 }],
		familiarWith: [''],
		education: [{
			qualification: '',
			place: '',
			startYear: '',
			endYear: '',
			grade: ''
		}],
		bio: ''
	});

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

	const resetForm = () => {
		setFormData({
			fullName: '',
			email: '',
			profilePic: '',
			skills: [{ skill: '', experience: 0 }],
			familiarWith: [''],
			education: [{
				qualification: '',
				place: '',
				startYear: '',
				endYear: '',
				grade: ''
			}],
			bio: '',
		});
	};

	const fetchWriters = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_URL}/writer`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			setWriters(response.data.data || []);
			setFilteredWriters(response.data.data || []);
		} catch (error) {
			console.error('Error fetching writers:', error);
			toast.error(error.response?.data?.message || 'Failed to fetch writers. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Search and Filter Logic
	useEffect(() => {
		let filtered = [...writers];

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(writer =>
				writer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				writer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				writer.familiarWith.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
				writer.skills.some(skill => skill.skill.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// Availability filter
		if (filterBy !== 'all') {
			const now = new Date();
			if (filterBy === 'available') {
				filtered = filtered.filter(writer => !writer.availableOn || new Date(writer.availableOn) < now);
			} else if (filterBy === 'busy') {
				filtered = filtered.filter(writer => writer.availableOn && new Date(writer.availableOn) > now);
			}
		}

		// Sort
		filtered.sort((a, b) => {
			let aValue = a[sortBy];
			let bValue = b[sortBy];

			if (sortBy === 'availableOn') {
				aValue = a.availableOn ? new Date(a.availableOn) : new Date(0);
				bValue = b.availableOn ? new Date(b.availableOn) : new Date(0);
			}

			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		setFilteredWriters(filtered);
	}, [writers, searchTerm, filterBy, sortBy, sortOrder]);

	const handleSort = (field) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(field);
			setSortOrder('asc');
		}
	};

	useEffect(() => {
		fetchWriters();
	}, []);

	const getChangedFields = () => {
		const changedFields = {};

		Object.keys(formData).forEach(key => {
			if (key === 'profilePic') {
				if (formData[key] instanceof File) {
					changedFields[key] = formData[key];
				}
			} else if (Array.isArray(formData[key])) {
				if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
					changedFields[key] = formData[key];
				}
			} else {
				if (formData[key] !== originalData[key]) {
					changedFields[key] = formData[key];
				}
			}
		});

		return changedFields;
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			let response;

			if (isEdit) {
				const changedFields = getChangedFields();

				if (Object.keys(changedFields).length === 0) {
					toast.info('No changes detected');
					setSubmitting(false);
					return;
				}

				const formDataToSend = new FormData();

				Object.keys(changedFields).forEach(key => {
					if (key === 'profilePic' && changedFields[key] instanceof File) {
						formDataToSend.append('profilePic', changedFields[key]);
					} else if (Array.isArray(changedFields[key])) {
						changedFields[key].forEach((item, index) => {
							if (typeof item === 'object') {
								Object.keys(item).forEach(subKey => {
									formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
								});
							} else {
								formDataToSend.append(`${key}[${index}]`, item);
							}
						});
					} else {
						formDataToSend.append(key, changedFields[key]);
					}
				});

				response = await axios.patch(`${API_URL}/writer/${formData._id}`, formDataToSend, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data'
					}
				});

				if (response.data.success) {
					toast.success('Writer updated successfully!');
					setShowModal(false);
					resetForm();
					fetchWriters();
				} else {
					toast.error(response.data.message || 'Failed to update writer.');
				}
			} else {
				const formDataToSend = new FormData();

				Object.keys(formData).forEach(key => {
					if (Array.isArray(formData[key])) {
						formData[key].forEach((item, index) => {
							if (typeof item === 'object') {
								Object.keys(item).forEach(subKey => {
									formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
								});
							} else {
								formDataToSend.append(`${key}[${index}]`, item);
							}
						});
					} else {
						formDataToSend.append(key, formData[key]);
					}
				});

				response = await axios.post(`${API_URL}/writer`, formDataToSend, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data'
					}
				});

				if (response.data.success){
					toast.success('Writer added successfully!');
					setShowModal(false);
					resetForm();
					fetchWriters();
				} else {
					toast.error(response.data.message || 'Failed to add writer.');
				}
			}
		} catch (error) {
			console.error(`Error ${isEdit ? 'updating' : 'adding'} writer:`, error);

			if (error.response?.status === 400) {
				toast.error(error.response.data.message || 'Invalid data provided.');
			} else if (error.response?.status === 404) {
				toast.error('Writer not found.');
			} else if (error.response?.status === 409) {
				toast.error('Email already exists.');
			} else {
				toast.error(`Failed to ${isEdit ? 'update' : 'add'} writer. Please try again.`);
			}
		} finally {
			setSubmitting(false);
		}
	};

	const deleteWriter = (id) => {
		if (window.confirm('Are you sure you want to delete this writer?')) {
			axios.delete(`${API_URL}/writer/${id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			})
				.then(response => {
					if (response.data.success) {
						toast.success('Writer deleted successfully!');
						fetchWriters();
					} else {
						toast.error(response.data.message || 'Failed to delete writer.');
					}
				})
				.catch(error => {
					console.error('Error deleting writer:', error);
					toast.error('Failed to delete writer. Please try again.');
				});
		}
	};

	const handleAddNew = () => {
		setShowModal(true);
		setIsEdit(false);
		resetForm();
	};

	const handleEdit = (writer) => {
		const editFormData = {
			...writer,
			skills: writer.skills?.length ? writer.skills : [{ skill: '', experience: 0 }],
			familiarWith: writer.familiarWith?.length ? writer.familiarWith : [''],
			education: writer.education?.length ? writer.education : [{
				qualification: '',
				place: '',
				startYear: new Date().getFullYear(),
				endYear: new Date().getFullYear(),
				grade: ''
			}]
		};

		setFormData(editFormData);
		setOriginalData(editFormData);
		setIsEdit(true);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setIsEdit(false);
		resetForm();
	};

	const getAvailabilityStatus = (writer) => {
		if (!writer.availableOn) return { text: 'Not Assigned', color: 'bg-green-100 text-green-800' };

		if (writer.ordersLeft === 0) {
			return { text: formatDate(writer.availableOn), color: 'bg-red-100 text-red-800' };
		} else {
			return { text: 'Available', color: 'bg-green-100 text-green-800' };
		}
	};

	return (
		<>
			<NavBar />
			<div className="min-h-screen bg-yellow-50 px-4 md:px-20 py-6">
				{/* Header */}
				<div className="mb-8">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div className="flex items-center gap-4">
							<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
								<Users className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Writer Management</h1>
								<p className="text-gray-600 mt-1">Manage your content writers and their profiles</p>
							</div>
						</div>
						<button
							onClick={handleAddNew}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							<UserPlus className="w-5 h-5" />
							Add Writer
						</button>
					</div>
				</div>

				{/* Search and Filter Bar */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search writers by name, email, or skills..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Filter Dropdown */}
						<div className="bg-white rounded-lg shadow-lg border border-gray-200 z-10">
							<select
								value={filterBy}
								onChange={(e) => setFilterBy(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-lg"
							>
								<option value="all">All Writers</option>
								<option value="available">Available</option>
								<option value="busy">Busy</option>
							</select>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="flex flex-col items-center py-16 space-y-3">
						<span className="w-14 h-14 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin" />
						<h3 className="text-xl font-semibold text-gray-900">Loading Writers...</h3>
						<p className="text-gray-600 mb-6">Please wait while we fetch the writers.</p>
					</div>
				) : (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{filteredWriters.length === 0 ? (
							<div className="text-center py-16">
								<div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
									<User className="w-16 h-16 text-gray-400" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{writers.length === 0 ? 'No writers yet' : 'No writers found'}
								</h3>
								<p className="text-gray-600 mb-6 max-w-md mx-auto">
									{writers.length === 0
										? 'Start building your writing team by adding your first writer.'
										: 'Try adjusting your search or filter criteria.'}
								</p>
								{writers.length === 0 && (
									<button
										onClick={handleAddNew}
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
									>
										<Plus className="w-5 h-5" />
										Add Your First Writer
									</button>
								)}
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 border-b border-gray-200">
										<tr>
											<th className="text-left py-4 px-6 font-semibold text-gray-900">
												<button
													onClick={() => handleSort('fullName')}
													className="flex items-center gap-2 hover:text-blue-600 transition-colors"
												>
													Writer
													<ArrowUpDown className="w-4 h-4" />
												</button>
											</th>
											<th className="text-left py-4 px-6 font-semibold text-gray-900">
												Skills
											</th>
											<th className="text-left py-4 px-6 font-semibold text-gray-900">
												<button
													onClick={() => handleSort('availableOn')}
													className="flex items-center gap-2 hover:text-blue-600 transition-colors"
												>
													Availability
													<ArrowUpDown className="w-4 h-4" />
												</button>
											</th>
											<th className="text-left py-4 px-6 font-semibold text-gray-900">
												<button
													onClick={() => handleSort('maxOrders')}
													className="flex items-center gap-2 hover:text-blue-600 transition-colors"
												>
													Orders Left
													<ArrowUpDown className="w-4 h-4" />
												</button>
											</th>
											<th className="text-left py-4 px-6 font-semibold text-gray-900">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredWriters.map((writer) => {
											const availability = getAvailabilityStatus(writer);

											return (
												<tr key={writer._id} className="hover:bg-gray-50 transition-colors">
													{/* Writer Column */}
													<td className="py-4 px-6 group cursor-pointer" onClick={() => handleEdit(writer)}>
														<div className="flex items-center gap-3">
															{writer.profilePic ? (
																<div className="relative flex-shrink-0">
																	{writer.profilePic ? (
																		<img
																			src={writer.profilePic}
																			alt={writer.fullName}
																			className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
																		/>
																	) : (
																		<div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
																			<User className="w-8 h-8 text-white" />
																		</div>
																	)}
																	{/* {writer.availableOn && new Date(writer.availableOn) < new Date() ? ( */}
																	{writer?.ordersLeft === 0 ? (
																		<div className="absolute -bottom-0.5 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-white"></div>
																	) : !writer.availableOn || new Date(writer.availableOn) > new Date() ? (
																		<div className="absolute -bottom-0.5 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
																	) : null}
																</div>
															) : (
																<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
																	<User className="w-5 h-5 text-white" />
																</div>
															)}
															<div>
																<div className="font-medium text-gray-900 group-hover:underline">{writer.fullName}</div>
																<div className="text-sm text-gray-500 flex items-center gap-1">
																	<Mail className="w-3 h-3" />
																	{writer.email}
																</div>
																<div className="flex items-center gap-1 mt-1">
																	{[...Array(5)].map((_, i) => (
																		<Star
																			key={i}
																			className={`w-3 h-3 ${i < writer.rating?.avgRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
																		/>
																	))}
																	<span className="text-xs text-gray-500 ml-1">({writer.rating?.count || 0})</span>
																</div>
															</div>
														</div>
													</td>

													{/* Skills Column */}
													<td className="py-4 px-6">
														<div className="flex flex-wrap gap-1">
															{writer.skills.slice(0, 3).map((skill, index) => (
																<span
																	key={index}
																	className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
																>
																	{skill.skill}
																</span>
															))}
															{writer.skills.length > 3 && (
																<span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
																	+{writer.skills.length - 3}
																</span>
															)}
														</div>
													</td>

													{/* Availability Column */}
													<td className="py-4 px-6">
														<span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
															{availability.text}
														</span>
													</td>

													{/* Orders Left Column */}
													<td className="py-4 px-6">
														<span className="text-sm text-gray-900 font-medium">{writer?.ordersLeft} / {writer?.maxOrders}</span>
													</td>

													{/* Actions Column */}
													<td className="py-4 px-6">
														<div className="flex items-center gap-2">
															<button
																onClick={() => handleEdit(writer)}
																className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
																title="View Profile"
															>
																<Eye className="w-4 h-4" />
															</button>
															<button
																onClick={() => handleEdit(writer)}
																className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 p-2 rounded-lg transition-colors"
																title="Edit Writer"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}

				{/* Modal */}
				<HandleWriter
					isOpen={showModal}
					onClose={closeModal}
					onSubmit={handleSubmit}
					writer={formData}
					setWriter={setFormData}
					submitting={submitting}
					isEdit={isEdit}
				/>
			</div>
		</>
	);
};

export default Writers;