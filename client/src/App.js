import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import Home from './Pages/Home/Home';
import CreateAccount from './Pages/CreateAccount/CreateAccount';
import Login from './Pages/Login/Login';
import Deposit from './Pages/Deposit/Deposit';
import Withdraw from './Pages/Withdraw/Withdraw';
import Balance from './Pages/Balance/Balance';
import AllData from './components/AllData/AllData';
import Footer from './components/Footer/Footer';
import { UserProvider, useUser } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import CanvasAnimation from './components/Animation/CanvasAnimation';
import Transfer from './Pages/Transfer/Transfer';
import Profile from './Pages/Profile/Profile';

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
                    <Route path="*" element={<Home />} />
                </Routes>
                {!currentUser && <CanvasAnimation />}
            </div>
            <Footer />
        </Router>
    );
}

export default App;
