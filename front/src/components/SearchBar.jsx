import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalForm from './ModalForm';
import '../styles/searchbar.css';

const SearchBar = ({ selectedOptions }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Open the modal and fetch the company ID
  const openModal = async () => {
    const company = selectedOptions?.company?.[0] || ''; // Get the first company name
    const color = selectedOptions?.color?.[0] || ''; // Get the first color

    try {
      // Fetch the company ID
      const companyId = await fetchCompanyIdByName(company);
      setSelectedCompanyId(companyId); // Set the company ID
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error opening modal:', error.message);
    }
  };

  const closeModal = () => setModalOpen(false);

  const fetchCompanyIdByName = async (companyName) => {
    try {
      const response = await axios.post('http://localhost/fetch_company_id.php', {
        company_name: companyName,
      });
      console.log(response.data);
      if (response.data?.id) {
        return response.data.id; // Return the company ID
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Error fetching company ID:', err.message);
      throw err; // Rethrow the error to handle it in openModal
    }
  };

  // Render the companies
  const renderOption = () => {
    const companies = selectedOptions?.company;

    if (!companies || companies.length === 0) return null;

    return (
      <ul className="filters-options-container">
        {companies.map((company, index) => (
          <li key={index} className="filter-option">
            {company}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    console.log('Selected Options in SearchBar:', selectedOptions);
  }, [selectedOptions]);

  return (
    <div className="searchBar">
      <span className="span-filters">Filters:</span>
      <div className="filterboxes">{renderOption()}</div>
      <div className="searchArea">
        <div className="searchLogo">
          <svg
            className="svglogo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="2" fill="none" />
            <line x1="16" y1="16" x2="20" y2="20" stroke="black" strokeWidth="2" />
          </svg>
          <input className="search-input" />
        </div>
      </div>
      <button className="openModalButton" onClick={openModal}>
        إضافة
      </button>
      {isModalOpen && <ModalForm closeModal={closeModal} id={selectedCompanyId} />}
    </div>
  );
};

export default SearchBar;
