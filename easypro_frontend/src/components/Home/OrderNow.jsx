const OrderNow = () => {
	return (
		<div className="py-16 px-4 md:px-20 relative overflow-hidden"
			style={{
				backgroundImage: "url('/waveFooter.png')",
				backgroundSize: "cover",
				backgroundPosition: "center"
			}}>
			<div className="py-14 px-20 md:px-24 bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
				<div className="flex items-start md:gap-2">
					<div className="space-y-2 md:space-y-4">
						<h4 className="text-2xl md:text-4xl">Your Deadline is</h4>
						<h1 className="text-4xl md:text-5xl font-medium font-serif">Our Priority</h1>
						<p className="text-sm">
							Join a growing community of more than <br />
							<span className="font-semibold">10,000+ Students</span>
						</p>
					</div>
					<img src="/journey/rocket.png" alt="" className='w-16 md:w-20 flex-shrink-0' />
				</div>
				<div className="space-y-4">
					<p className="text-sm md:text-base">
						We've helped students across courses, colleges, and
						crunch times and their words say it best. From tight
						deadlines to tough topics
					</p>
					<button className="bg-cyan-400 hover:bg-cyan-500 py-3 px-4 rounded-full text-sm">Place Your Order Now</button>
				</div>
			</div>
		</div>
	)
}

export default OrderNow