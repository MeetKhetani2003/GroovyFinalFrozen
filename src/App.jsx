import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

import CreateProduct from './components/organisms/Admin/CreateProduct';
import Customers from './components/organisms/Admin/Customers';
import Dashboard from './components/organisms/Admin/Dashboard';
import Products from './components/organisms/Admin/Products';
import AuthCallback from './components/organisms/auth/AuthCallback';
import AuthContainer from './components/organisms/auth/AuthContainer';
import SigninContainer from './components/organisms/auth/SignInContainer';
import SignupContainer from './components/organisms/auth/SignupContainer';
import Layout from './components/organisms/layout/Layout';
import MenuDetail from './components/organisms/Menu/MenuDetail';
import About from './pages/About';
import AboutUs from './pages/About';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CheckoutPage from './pages/CheckoutPAge';
import Contact from './pages/Contact';
import ContactUs from './pages/Contact';
import Home from './pages/Home';
import Menu from './pages/MenuPage';
import Success from './pages/Success';
import AdminProtectedRoute from './utils/AdminProtected';
// import ProtectedRoute from './utils/ProtectedRoute';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? children : <Navigate to='/admin/login' />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing auth routes */}
        <Route
          path='/auth/signup'
          element={
            <AuthContainer>
              <SignupContainer />
            </AuthContainer>
          }
        />
        <Route
          path='/auth/login'
          element={
            <AuthContainer>
              <SigninContainer />
            </AuthContainer>
          }
        />

        {/* Admin routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route
          path='/admin'
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='customers' element={<Customers />} />
          <Route path='products' element={<Products />} />
          <Route path='products/create' element={<CreateProduct />} />
        </Route>

        {/* Existing layout routes */}
        <Route path='/' element={<Layout />}>
          <Route path='/facebook/callback' element={<AuthCallback />} />
          <Route path='/google/callback' element={<AuthCallback />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/success' element={<Success />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route index element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:id' element={<MenuDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
