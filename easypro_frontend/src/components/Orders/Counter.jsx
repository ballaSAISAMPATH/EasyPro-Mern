import { Plus, Minus } from 'lucide-react';

const Counter = ({ value, onChange, min = 0, max = 100, label }) => {
	return (
		<div className="flex items-center space-x-3">
			<button
				onClick={() => onChange(Math.max(min, value - 1))}
				disabled={value <= min}
				className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Minus size={16} />
			</button>
			<div className="flex flex-col items-center">
				<span className="text-lg font-medium w-12 text-center">{value}</span>
				{label && <span className="text-xs text-gray-500">{label}</span>}
			</div>
			<button
				onClick={() => onChange(Math.min(max, value + 1))}
				disabled={value >= max}
				className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Plus size={16} />
			</button>
		</div>
	);
};

export default Counter;