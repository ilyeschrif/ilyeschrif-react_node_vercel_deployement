import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import arrow from '../left-arrow.png';
import logo from '../assets/images/logo1.png'; // Adjust the path to your logo

const Header = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:2000/companies');
            const data = await response.json();
              if (Array.isArray(data)) {
                setCompanies(data);
            } else {
                console.error("Error with data:", data);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    fetchCompanies();
}, []);

  const handleClick = (route, data) => {
    navigate(route, { state: { companyData: data } });
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  return (
    <div className='header'>
      <div className='logo-section' onClick={() => navigate('/')}>
        <p className='company-name left'>الأصفر الدوالي</p>
        <img src={logo} alt="Logo" className='logo' />
        <p className='company-name right'>AL SAFEER AL DAWLY</p>
      </div>
      <div className='nav-section'>
        <div className='navbar-container'>
          <ul>
            <li onClick={() => handleClick('/contact')}>اتصل بنا</li>
            <li onClick={() => handleClick('/about')}>من نحن</li>
            <li onClick={() => handleClick('/services')}>الكتالوج</li>
            <li className="dropdown" onClick={toggleDropdown}>
              الشركات
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-chevron-down"
                viewBox="0 0 16 16"
              >
                <path d="M1.293 4.293a1 1 0 0 1 1.414 0L8 9.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z" />
              </svg>
            </li>
          </ul>
        </div>

        {dropdownVisible && (
          <div className='dropdown-company-menu'>
            {companies.length > 0 ? (
              companies.map((company) => (
                <div
                  key={company.id}
                  className='dropdown-link'
                  onClick={() => handleClick('/catalogue', company.company_name)}
                >
                  <img src={arrow} alt="arrow" className="arrow" />
                  <p>{company.company_name}</p>
                </div>
              ))
            ) : (
              <p className='dropdown-message'>Chargement...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
