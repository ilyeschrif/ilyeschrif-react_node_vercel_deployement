import React from "react";
import "../../styles/home.css";
import home1 from "../../assets/images/home1.jpg";
import home2 from "../../assets/images/home2.jpg";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">مرحبا بكم في شركتنا : السفير الدولي</h1>
        <p className="hero-description">
        اكتشف خدماتنا ومنتجاتنا والشركات الشريكة
        </p>
      </div>
      <div className="image-section">
        <img
          src={home1}
          alt="Sample"
          className="home-image"
        />
        <img
          src={home2}
          alt="Sample 2"
          className="home-image"
        />
      </div>
      <div className="cta-section">
        <button className="cta-button" onClick={() => window.location.href = '/catalogue'}>
        اكتشف الكتالوج
        </button>
      </div>
    </div>
  );
};

export default Home;
