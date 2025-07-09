import { PenTool, Edit3, Code, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderTypeSelection = ({ updateOrderData, onNext }) => {
	const navigate = useNavigate();
	const orderTypes = [
		{
			type: 'writing',
			icon: PenTool,
			title: 'Writing',
			description: 'Get an essay or paper written according to your instructions by a professional writer.',
			color: 'blue'
		},
		{
			type: 'editing',
			icon: Edit3,
			title: 'Editing',
			description: 'Get your paper edited, proofread, or have AI content revised by a professional editor.',
			color: 'green'
		},
		{
			type: 'technical',
			icon: Code,
			title: 'Technical',
			description: 'Get an expert\'s help with math problems, data analysis, coding, labs, accounting, etc.',
			color: 'purple'
		}
	];

	const selectType = (type) => {
		updateOrderData({
			type,
			paperType: '',
			subject: '',
			otherSubject: '',
			otherPaperType: '',
			otherSoftware: '',
			instructions: '',
			files: [],
			pageCount: 1,
			slides: 0,
			showSlides: false,
			deadline: '',
			software: 'Not applicable',
			showSoftware: false,
			selectedWriter: null
		});
		setTimeout(onNext, 150);
	};

	return (
		<div className="space-y-6">
			<div className="text-center relative">
				<button
					onClick={() => navigate(-1)}
					className="absolute left-0 top-0 flex items-center py-2 px-3 pl-0 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors shadow-md"
				>
					<ChevronLeft className='h-4' /> Back
				</button>
				<h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-12 md:pt-0 mb-2">Choose Your Order Type</h2>
				<p className="text-gray-600">Select the type of service you need</p>
			</div>

			<div className="grid gap-4">
				{orderTypes.map(({ type, icon: Icon, title, description, color }) => (
					<button
						key={type}
						onClick={() => selectType(type)}
						className="p-4 sm:p-6 border-2 rounded-lg text-left transition-all hover:shadow-md hover:scale-[1.01] border-gray-200 hover:border-gray-300"
					>
						<div className="flex items-start space-x-4">
							<div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-purple-500'} text-white`}>
								<Icon size={24} />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
								<p className="text-gray-600 text-sm leading-relaxed">{description}</p>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default OrderTypeSelection;