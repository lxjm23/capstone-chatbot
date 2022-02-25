import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Landing from './pages/Landing';
import About from './pages/About';
import Event from './events/Event';
import Chatbot from './chatbot/Chatbot';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => (
    <div>
        <BrowserRouter>
            <div className="container">
                <Header />
                <Routes>
                    <Route exact path="/" element={<Landing />} />
                </Routes>
                <Routes>
                    <Route exact path="/event" element={<Event />} />
                </Routes>
                <Routes>
                    <Route exact path="/about" element={<About />} />
                </Routes>
              
                <Chatbot />
            </div>
        </BrowserRouter>
    </div>
)

export default App;