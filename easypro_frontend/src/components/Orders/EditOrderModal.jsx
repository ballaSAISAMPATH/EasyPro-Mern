import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const EditOrderModal = ({ order, onClose, onSave }) => {
	const [formData, setFormData] = useState({
		subject: order.subject,
		deadline: new Date(order.deadline).toISOString().slice(0, 16),
		instruction: order.instruction || '',
		paperType: order.paperType || '',
		pageCount: order.pageCount || 1,
		slides: order.slides || '',
		files: order.files || []
	});
	const [newFile, setNewFile] = useState('');
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		// Reset form when order changes
		setFormData({
			subject: order.subject,
			deadline: new Date(order.deadline).toISOString().slice(0, 16),
			instruction: order.instruction || '',
			paperType: order.paperType || '',
			pageCount: order.pageCount || 1,
			slides: order.slides || '',
			files: order.files || []
		});
		setErrors({});
	}, [order]);

	const validate = () => {
		const newErrors = {};
		const now = new Date();
		const selectedDeadline = new Date(formData.deadline);

		if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
		if (!formData.deadline) newErrors.deadline = 'Deadline is required';
		if (selectedDeadline <= now) newErrors.deadline = 'Deadline must be in the future';
		if (formData.pageCount < 1) newErrors.pageCount = 'Must be at least 1 page';

		if (order.type === 'writing') {
			if (!formData.paperType.trim()) newErrors.paperType = 'Paper type is required';
			if (formData.slides && formData.slides < 1) newErrors.slides = 'Must be at least 1 slide';
		}

		if (order.type === 'editing' && formData.files.length === 0) {
			newErrors.files = 'At least one file is required for editing';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === 'pageCount' || name === 'slides' ? parseInt(value) || 0 : value
		}));
	};

	const handleAddFile = () => {
		if (newFile.trim()) {
			setFormData(prev => ({
				...prev,
				files: [...prev.files, newFile.trim()]
			}));
			setNewFile('');
			if (errors.files) setErrors(prev => ({ ...prev, files: null }));
		}
	};

	const handleRemoveFile = (index) => {
		setFormData(prev => ({
			...prev,
			files: prev.files.filter((_, i) => i !== index)
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			// Prepare the data to send
			const dataToSend = {
				subject: formData.subject,
				deadline: formData.deadline,
				instruction: formData.instruction,
				pageCount: formData.pageCount,
				files: formData.files
			};

			if (order.type === 'writing') {
				dataToSend.paperType = formData.paperType;
				if (formData.slides) dataToSend.slides = formData.slides;
			}

			const response = await axios.put(
				`${API_URL}/order/${order._id}`,
				dataToSend,
				{
					headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
				}
			);

			onSave(response.data.data);
			onClose();
		} catch (error) {
			console.error('Error updating order:', error);
			setErrors({ submit: 'Failed to update order. Please try again.' });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
					<h2 className="text-xl font-bold">Edit {order.type} Order</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					{/* Common Fields */}
					<div>
						<label className="block text-gray-700 mb-1">Subject*</label>
						<input
							type="text"
							name="subject"
							value={formData.subject}
							onChange={handleChange}
							className={`w-full p-2 border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
						/>
						{errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
					</div>

					<div>
						<label className="block text-gray-700 mb-1">Deadline*</label>
						<input
							type="datetime-local"
							name="deadline"
							value={formData.deadline}
							onChange={handleChange}
							min={new Date().toISOString().slice(0, 16)}
							className={`w-full p-2 border rounded-md ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
						/>
						{errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
					</div>

					<div>
						<label className="block text-gray-700 mb-1">Instructions</label>
						<textarea
							name="instruction"
							value={formData.instruction}
							onChange={handleChange}
							rows={3}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>

					{/* Writing Specific Fields */}
					{order.type === 'writing' && (
						<>
							<div>
								<label className="block text-gray-700 mb-1">Paper Type*</label>
								<input
									type="text"
									name="paperType"
									value={formData.paperType}
									onChange={handleChange}
									className={`w-full p-2 border rounded-md ${errors.paperType ? 'border-red-500' : 'border-gray-300'}`}
									placeholder="e.g., Research Paper, Essay, etc."
								/>
								{errors.paperType && <p className="text-red-500 text-sm mt-1">{errors.paperType}</p>}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-gray-700 mb-1">Page Count*</label>
									<input
										type="number"
										name="pageCount"
										min="1"
										value={formData.pageCount}
										onChange={handleChange}
										className={`w-full p-2 border rounded-md ${errors.pageCount ? 'border-red-500' : 'border-gray-300'}`}
									/>
									{errors.pageCount && <p className="text-red-500 text-sm mt-1">{errors.pageCount}</p>}
								</div>

								<div>
									<label className="block text-gray-700 mb-1">Slides (optional)</label>
									<input
										type="number"
										name="slides"
										min="1"
										value={formData.slides}
										onChange={handleChange}
										className={`w-full p-2 border rounded-md ${errors.slides ? 'border-red-500' : 'border-gray-300'}`}
										placeholder="Number of slides"
									/>
									{errors.slides && <p className="text-red-500 text-sm mt-1">{errors.slides}</p>}
								</div>
							</div>
						</>
					)}

					{/* Editing Specific Fields */}
					{order.type === 'editing' && (
						<div>
							<label className="block text-gray-700 mb-1">Page Count*</label>
							<input
								type="number"
								name="pageCount"
								min="1"
								value={formData.pageCount}
								onChange={handleChange}
								className={`w-full p-2 border rounded-md ${errors.pageCount ? 'border-red-500' : 'border-gray-300'}`}
							/>
							{errors.pageCount && <p className="text-red-500 text-sm mt-1">{errors.pageCount}</p>}
						</div>
					)}

					{/* Files Section */}
					<div>
						<label className="block text-gray-700 mb-1">
							{order.type === 'editing' ? 'Files*' : 'Files (optional)'}
						</label>
						<div className="flex gap-2 mb-2">
							<input
								type="text"
								value={newFile}
								onChange={(e) => setNewFile(e.target.value)}
								placeholder="Paste file URL"
								className="flex-1 p-2 border border-gray-300 rounded-md"
							/>
							<button
								type="button"
								onClick={handleAddFile}
								className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 flex items-center"
							>
								<Plus size={16} className="mr-1" /> Add
							</button>
						</div>
						{errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}

						{formData.files.length > 0 && (
							<div className="border rounded-md divide-y">
								{formData.files.map((file, index) => (
									<div key={index} className="p-2 flex justify-between items-center">
										<div className="flex items-center truncate">
											<FileText size={16} className="text-gray-500 mr-2 flex-shrink-0" />
											<span className="truncate">{file}</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveFile(index)}
											className="text-red-500 hover:text-red-700 p-1"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{errors.submit && (
						<p className="text-red-500 text-center">{errors.submit}</p>
					)}

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
						>
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditOrderModal;