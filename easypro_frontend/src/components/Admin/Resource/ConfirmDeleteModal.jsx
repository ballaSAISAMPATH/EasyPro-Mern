const ConfirmDeleteModal = ({ isOpen, isLoading, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
			<div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
				<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
				<p className="text-gray-600 mb-4">Are you sure you want to remove the Resource?</p>
				<div className="flex gap-2 justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						onClick={(onConfirm)}
						disabled={isLoading}
						className={`px-4 py-2 flex items-center text-white rounded ${isLoading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
					>
						{
							isLoading ?
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Deleting...
								</> :
								"Delete"
						}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDeleteModal