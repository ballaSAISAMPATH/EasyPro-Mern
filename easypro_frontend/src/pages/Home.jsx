import NavBar from "../components/NavBar"
import EssayProJourney from "../components/Home/EssayProJourney"
import Hero from "../components/Home/Hero"
import EssayWritersServices from "../components/Home/EssayWritersServices"
import TestimonialCards from "../components/Home/TestimonialCards"
import OrderNow from "../components/Home/OrderNow"
import Footer from "../components/Footer"

const Home = () => {
	return (
		<>
			<NavBar />
			<Hero />
			<div id="essay-pro-journey" className="pt-20">
				<EssayProJourney />
			</div>
			<div id="essay-writers-services" className="pt-20">
				<EssayWritersServices />
			</div>
			<div id="testimonials" className="pt-20">
				<TestimonialCards />
			</div>
			<OrderNow />
			<div id="footer">
				<Footer />
			</div>
		</>
	)
}

export default Home