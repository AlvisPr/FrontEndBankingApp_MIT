import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer/Footer';
import { UserProvider, useUser } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import CanvasAnimation from './components/Animation/CanvasAnimation';

// Lazy load page components
const Home = React.lazy(() => import('./Pages/Home/Home'));
const CreateAccount = React.lazy(() => import('./Pages/CreateAccount/CreateAccount'));
const Login = React.lazy(() => import('./Pages/Login/Login'));
const Deposit = React.lazy(() => import('./Pages/Deposit/Deposit'));
const Withdraw = React.lazy(() => import('./Pages/Withdraw/Withdraw'));
const Balance = React.lazy(() => import('./Pages/Balance/Balance'));
const Transfer = React.lazy(() => import('./Pages/Transfer/Transfer'));
const Profile = React.lazy(() => import('./Pages/Profile/Profile'));
const AllData = React.lazy(() => import('./components/AllData/AllData'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel/AdminPanel'));

// Loading component
const LoadingFallback = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

function AppContent() {
    const { currentUser } = useUser();
    return (
        <Router>
            <NavBar />
            <div className="content-container">
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/createaccount" element={<CreateAccount />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/deposit" element={<Deposit />} />
                        <Route path="/withdraw" element={<Withdraw />} />
                        <Route path="/balance" element={<Balance />} />
                        <Route path="/transfer" element={<Transfer />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/alldata" element={<AllData />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </Suspense>
                {!currentUser && <CanvasAnimation />}
            </div>
            <Footer />
        </Router>
    );
}

export default App;
