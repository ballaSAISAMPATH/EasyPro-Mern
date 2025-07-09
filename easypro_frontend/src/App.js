import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import MyOrders from './pages/MyOrders';
import TopWriters from './pages/TopWriters';
import Profile from './pages/Profile';
import PlaceOrder from './pages/PlaceOrder';
import HowItWorks from './pages/HowItWorks';
import Reviews from './pages/Reviews';
import Faqs from './pages/Faqs';
import ContactUs from './pages/ContactUs';
import AdminHome from './pages/AdminHome';
import OrderDetails from './pages/OrderDetails';
import Writers from './pages/Admin/Writers';
import Users from './pages/Admin/Users';
import Orders from './pages/Admin/Orders';
import OrderDetailLayout from './pages/Admin/OrderDetailLayout';
import ResourceList from './pages/ResourceList';
import Resources from './pages/Admin/Resources';
import Plagiarism_Checker from './pages/Services/Plagiarism_Checker';
const App = () => {
  const UserAuthentication =({children})=>{
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
		const token = localStorage.getItem('token');
    console.log(storedUser);
    
		if (storedUser && token ) {
      return children;
		}
    else{
      return <Navigate to='/'/>
    }
  }
  return (
    <BrowserRouter>
      <ToastContainer position='top-center' pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Plagiarism_Checker" element={<UserAuthentication><Plagiarism_Checker /></UserAuthentication>} />
        <Route path="/user" element={<Profile />} />
        <Route path="/user/orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/top-writers" element={<TopWriters />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/resources" element={<ResourceList />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/writers" element={<Writers />} />
        <Route path="/admin/writer/:id" element={<Writers />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/resources" element={<Resources />} />
        <Route path="/admin/order/:id" element={<OrderDetailLayout />} />
        <Route path="/res" element={<OrderDetailLayout />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App