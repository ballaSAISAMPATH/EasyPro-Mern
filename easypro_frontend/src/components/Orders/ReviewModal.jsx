import React, { useState } from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';

const ReviewModal = ({ isOpen, order, reviewData, setReviewData, handleSubmitReview, onClose }) => {
	const [newCustomFieldName, setNewCustomFieldName] = useState('');

	const handleRatingChange = (field, value) => {
		setReviewData({
			...reviewData,
			[field]: value
		});
	};

	const handleReviewDescriptionChange = (e) => {
		setReviewData({
			...reviewData,
			description: e.target.value
		});
	};

	const addCustomField = () => {
		if (newCustomFieldName.trim()) {
			setReviewData({
				...reviewData,
				other: [
					...(reviewData.other || []),
					{
						name: newCustomFieldName,
						rating: 0
					}
				]
			});
			setNewCustomFieldName('');
		}
	};

	const updateCustomFieldRating = (index, rating) => {
		const updatedOther = [...reviewData.other];
		updatedOther[index].rating = rating;
		setReviewData({
			...reviewData,
			other: updatedOther
		});
	};

	const removeCustomField = (index) => {
		const updatedOther = [...reviewData.other];
		updatedOther.splice(index, 1);
		setReviewData({
			...reviewData,
			other: updatedOther
		});
	};

	// Check if all ratings are filled
	const isReviewValid = () => {
		const mainRatingsValid = ['followingInstructions', 'grammar', 'responseSpeed', 'formatting'].every(
			field => reviewData[field] > 0
		);

		const customRatingsValid = (reviewData.other || []).every(
			field => field.rating > 0
		);

		return mainRatingsValid && customRatingsValid;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-6 border-b py-6 px-6">
					{order.review ? 'Review Details' : 'Leave a Review'}
				</h3>

				<div className='max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pl-6'>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{['followingInstructions', 'grammar', 'responseSpeed', 'formatting'].map((field) => (
							<div key={field}>
								<p className="text-sm font-medium text-gray-700 mb-1 capitalize">
									{field.replace(/([A-Z])/g, ' $1')}
								</p>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`w-6 h-6 transition ${star <= reviewData[field] ? 'text-yellow-400' : 'text-gray-300'
												} ${order.review ? '' : 'hover:scale-110 cursor-pointer'}`}
											fill={star <= reviewData[field] ? 'currentColor' : 'none'}
											onClick={
												order.review ? undefined : () => handleRatingChange(field, star)
											}
										/>
									))}
								</div>
							</div>
						))}

					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t mt-4'>
						{(reviewData.other || []).map((field, index) => (
							<div key={index} className="pt-4">
								<div className="flex justify-between items-center mb-2">
									<p className="text-sm font-medium text-gray-700">{field.name}</p>
									{!order.review && (
										<button
											onClick={() => removeCustomField(index)}
											className="text-red-500 hover:text-red-700"
											title="Remove field"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`w-6 h-6 transition ${star <= field.rating ? 'text-yellow-400' : 'text-gray-300'
												} ${order.review ? '' : 'hover:scale-110 cursor-pointer'}`}
											fill={star <= field.rating ? 'currentColor' : 'none'}
											onClick={
												order.review
													? undefined
													: () => updateCustomFieldRating(index, star)
											}
										/>
									))}
								</div>
							</div>
						))}

						{/* Add Custom Field */}
						{!order.review && (
							<div className="flex gap-2 mt-4">
								<input
									type="text"
									value={newCustomFieldName}
									onChange={(e) => setNewCustomFieldName(e.target.value)}
									placeholder="Custom rating field"
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									onClick={addCustomField}
									disabled={!newCustomFieldName.trim()}
									className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
								>
									<Plus className="w-4 h-4" />
									Add
								</button>
							</div>
						)}
					</div>
					{/* Description */}
					<div className="mt-4">
						<p className="text-sm font-medium text-gray-700 mb-1">Description</p>
						{order.review ? (
							<p className="bg-gray-100 text-gray-800 p-3 rounded-md whitespace-pre-wrap shadow-sm">
								{reviewData.description}
							</p>
						) : (
							<textarea
								value={reviewData.description}
								onChange={handleReviewDescriptionChange}
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
								placeholder="Share your experience..."
							/>
						)}
					</div>
				</div>

				{/* Buttons */}
				<div className="flex justify-end gap-3 mt-6 border-t p-6">
					<button
						onClick={() => {
							setReviewData({
								followingInstructions: 0,
								grammar: 0,
								responseSpeed: 0,
								formatting: 0,
								other: [],
								description: '',
								writer: order.writer?._id,
								order: order._id
							});
							onClose();
						}}
						className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
					>
						Close
					</button>
					{!order.review && (
						<button
							onClick={handleSubmitReview}
							disabled={!isReviewValid()}
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
						>
							Submit
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReviewModal;