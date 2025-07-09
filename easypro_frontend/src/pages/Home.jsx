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
			<EssayProJourney />
			<EssayWritersServices />
			<TestimonialCards />
			<OrderNow />
			<Footer />
		</>
	)
}

export default Home