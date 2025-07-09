import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ReasonModal = ({ reason, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold flex items-center">
						<AlertCircle className="mr-2 text-red-500" size={24} />
						Cancellation Reason
					</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X size={24} />
					</button>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<p className="text-red-700">{reason || 'No reason provided'}</p>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReasonModal;