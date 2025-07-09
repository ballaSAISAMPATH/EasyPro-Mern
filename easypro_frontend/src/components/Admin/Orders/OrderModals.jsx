import { Eye, FileText, X } from "lucide-react";

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

// Assign Writer Modal
export const AssignWriterModal = ({ isOpen, onClose, order, writers, onAssign }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Assign Writer</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						&times;
					</button>
				</div>

				<div className="mb-4">
					<p className="font-medium">Order Details:</p>
					<p>Type: {order?.type}</p>
					<p>Subject: {order?.subject}</p>
					<p>Deadline: {new Date(order?.deadline).toLocaleString()}</p>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">Available Writers:</label>
					{writers.length > 0 ? (
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{writers.map((writer) => (
								<div key={writer._id} className="flex items-center justify-between p-2 border rounded">
									<div>
										<p className="font-medium">{writer.fullName}</p>
										<p className="text-sm text-gray-600">
											Rating: {writer.rating.avgRating} ({writer.rating.count}) • Orders Left: {writer.ordersLeft}
										</p>
										<p className="text-sm text-gray-600">
											Skills: {writer.skills?.map(s => s.skill).join(', ')}
										</p>
									</div>
									<button
										onClick={() => onAssign(writer._id)}
										className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
									>
										Assign
									</button>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No available writers match this order's requirements.</p>
					)}
				</div>

				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

// View Review Modal
export const ViewReviewModal = ({ isOpen, onClose, review }) => {
	if (!isOpen || !review) return null;

	const renderRatingStars = (rating) => {
		return (
			<div className="flex">
				{[...Array(5)].map((_, i) => (
					<svg
						key={i}
						className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				))}
			</div>
		);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Order Review</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						&times;
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="font-medium">Following Instructions</h3>
						{renderRatingStars(review.followingInstructions)}
					</div>

					<div>
						<h3 className="font-medium">Grammar</h3>
						{renderRatingStars(review.grammar)}
					</div>

					<div>
						<h3 className="font-medium">Response Speed</h3>
						{renderRatingStars(review.responseSpeed)}
					</div>

					<div>
						<h3 className="font-medium">Formatting</h3>
						{renderRatingStars(review.formatting)}
					</div>

					{review.other?.length > 0 && (
						<div>
							<h3 className="font-medium">Other Ratings</h3>
							<div className="space-y-2">
								{review.other.map((item, index) => (
									<div key={index}>
										<p>{item.name}: {renderRatingStars(item.rating)}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{review.description && (
						<div>
							<h3 className="font-medium">Description</h3>
							<p className="whitespace-pre-wrap">{review.description}</p>
						</div>
					)}
				</div>

				<div className="flex justify-end mt-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

// View Reason Modal
export const ViewReasonModal = ({ isOpen, onClose, reason }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Cancellation Reason</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						&times;
					</button>
				</div>

				<div className="mb-4">
					<p className="whitespace-pre-wrap">{reason || 'No reason provided'}</p>
				</div>

				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

// Response Summary Modal
export const ResponseSummaryModal = ({ isOpen, onClose, responses, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Response Summary</h2>
					<X onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer"/>
				</div>

				<div className="mb-4 max-h-96 overflow-y-auto">
					<h3 className="font-medium text-lg mb-2">Files to be submitted:</h3>
					<div className="gap-2 grid grid-cols-1 md:grid-cols-2 py-3">
						{responses.map((response, index) => (
							<div key={index} className="bg-white p-4 rounded-lg shadow-md">
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
				</div>

				<div className="flex justify-end space-x-3">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Confirm Submission
					</button>
				</div>
			</div>
		</div>
	);
};