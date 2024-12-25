import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Catalogue from './components/pages/Catalogue'; // Import the Catalogue page
import ProductPage from './components/pages/ProductPage'; // Import the ProductPage
import Home from './components/pages/Home';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Route pour la page d'accueil */}
          <Route path="/catalogue" element={<Catalogue />} /> 
          <Route path="/product" element={<ProductPage />} /> {/* Add the ProductPage route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
