import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Balance from './components/Balance';
import AllData from './components/AllData';
import Footer from './components/Footer';
import { UserProvider, useUser } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import CanvasAnimation from './components/CanvasAnimation';

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
                    <Route path="/alldata" element={<AllData />} />
                </Routes>
                {!currentUser && <CanvasAnimation />}
            </div>
            <Footer />
        </Router>
    );
}

export default App;