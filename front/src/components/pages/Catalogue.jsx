import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';
import '../../styles/catalogue.css';
import SearchBar from '../SearchBar';
import Card from '../Card';
import axios from 'axios';

const Catalogue = () => {
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [colors, setColors] = useState([]);
  const [value1, setValue1] = useState([0, 300]);
  const [value2, setValue2] = useState([0, 300]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);

  const location = useLocation();
  const companyData = location.state?.companyData;

  const [selectedOptions, setSelectedOptions] = useState({
    type: [],
    company: [],
    color: [],
    dimensions: { length: [0, 300], width: [0, 300] },
  });

  const fetchTilesByColorAndCompany = async (selectedColor, selectedCompanyId) => {
    try {
      if (!selectedColor || !selectedCompanyId) return;

      const response = await axios.post('http://localhost/fetch_tiles_by_color_and_company.php', {
        color: selectedColor,
        company_id: selectedCompanyId,
      });

      if (response.data && Array.isArray(response.data)) {
        setTiles(response.data);
      } else if (response.data.error) {
        setError(response.data.error);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching tiles by color and company:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (color && selectedCompanyId) {
      fetchTilesByColorAndCompany(color, selectedCompanyId);
    }
  }, [color, selectedCompanyId]);

  const fetchTilesBySize = async (lengthMin, lengthMax, widthMin, widthMax) => {
    try {
      const response = await axios.post('http://localhost:2000/fetch-tiles-by-size', {
        length_min: lengthMin,
        length_max: lengthMax,
        width_min: widthMin,
        width_max: widthMax,
      });
      console.log(response.data);
  
      if (response.data && Array.isArray(response.data)) {
        setTiles(response.data);  // Assuming setTiles is a state setter function for storing the tiles data
      } else if (response.data.error) {
        setError(response.data.error);  // Assuming setError is a state setter function for error messages
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching tiles by size:', err.message);
      setError(err.message);  // Display the error message
    }
  };
  
  
  

  useEffect(() => {
    const [lengthMin, lengthMax] = value1;
    const [widthMin, widthMax] = value2;
  
    if (
      Number.isFinite(lengthMin) &&
      Number.isFinite(lengthMax) &&
      Number.isFinite(widthMin) &&
      Number.isFinite(widthMax)
    ) {
      fetchTilesBySize(lengthMin, lengthMax, widthMin, widthMax);
    } else {
      console.warn('Invalid size values:', value1, value2);
    }
  }, [value1, value2]); // Dependencies: Updates only when value1 or value2 changes
  
  

  useEffect(() => {
    // Fetch company names and IDs
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost/fetch-companies.php");
        if (response.data && Array.isArray(response.data)) {
          setCompanies(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const fetchCompanyIdByName = async (companyName) => {
    try {
      const response = await axios.post('http://localhost:3000/get-company-id', {
        company_name: companyName,
      });
  
      if (response.data?.id) {
        setSelectedCompanyId(response.data.id);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Error fetching company ID:', err.message);
    }
  };
  
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:2000/tile-types'); // Updated API endpoint
        if (response.data && Array.isArray(response.data)) {
          setTypes(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching types:', err.message);
      }
    };
  
    fetchTypes();
  }, []);
  


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost/fetch-companies.php');
        if (!response.ok) throw new Error('Failed to fetch companies');
        const data = await response.json();
        if (Array.isArray(data)) setCompanies(data);
        else throw new Error('Invalid data format');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get('http://localhost/fetch-colors.php');
        if (response.data && Array.isArray(response.data)) {
          setColors(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching colors:', err.message);
      }
    };
    fetchColors();
  }, []);


  useEffect(() => {
    const fetchTiles = async () => {
      try {
        if (!selectedCompanyId) return;
  
        const response = await axios.get(`http://localhost/TilesByCompany.php?company_id=${selectedCompanyId}`);
        if (response.data && Array.isArray(response.data)) {
          setTiles(response.data);
          console.log(tiles.sizes);
        } else if (response.data.error) {
          console.error('API Error:', response.data.error);
          setError(response.data.error);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (err) {
        console.error('Error fetching tiles:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTiles();
  }, [selectedCompanyId]);
  

  useEffect(() => {
    if (companyData) {
      setSelectedOptions((prevState) => ({
        ...prevState,
        company: [companyData],
      }));
      fetchCompanyIdByName(companyData);
    }
  }, [companyData]);

  const fetchTilesForCompanies = async (companyIds) => {
    try {
      const requests = companyIds.map((id) =>
        axios.get(`http://localhost/TilesByCompany.php?company_id=${id}`)
      );
  
      const responses = await Promise.all(requests);
  
      const aggregatedTiles = responses.flatMap((res) =>
        Array.isArray(res.data) ? res.data : []
      );
  
      setTiles(aggregatedTiles);
    } catch (err) {
      console.error("Error fetching tiles for companies:", err.message);
      setError(err.message);
    }
  };
  
  useEffect(() => {
    if (companyData) {
      const fetchInitialCompanyId = async () => {
        try {
          const response = await axios.post('http://localhost:2000/get-company-id', {
            company_name: companyData,
          });

          if (response.data?.id) {
            const initialCompanyId = response.data.id;
            setSelectedCompanyIds([initialCompanyId]);
            setSelectedOptions((prevState) => ({
              ...prevState,
              company: [companyData],
            }));
          } else {
            setError('Company not found');
          }
        } catch (err) {
          console.error('Error fetching initial company ID:', err.message);
          setError('Failed to fetch company ID');
        }
      };

      fetchInitialCompanyId();
    }
  }, [companyData]);
  
  const handleCompanyChange = async (e) => {
    const { value, checked } = e.target;
      const companyId = companies.find((company) => company.company_name === value)?.id;
  
    if (!companyId) return;
      setSelectedCompanyIds((prev) => {
      const updatedIds = checked ? [...prev, companyId] : prev.filter((id) => id !== companyId);
        fetchTilesForCompanies(updatedIds);
      return updatedIds;
    });
  
    setSelectedOptions((prevState) => ({
      ...prevState,
      company: checked
        ? [...prevState.company, value]
        : prevState.company.filter((company) => company !== value),
    }));
  };
  
  
  

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  

  const fetchTilesByTypeAndCompany = async (selectedType, selectedCompanyId) => {
    try {
      if (!selectedType || !selectedCompanyId) return;
  
      const response = await axios.post('http://localhost/fetch_tiles_by_type_and_company.php', {
        type: selectedType,
        company_id: selectedCompanyId,
      });
  
      if (response.data && Array.isArray(response.data)) {
        setTiles(response.data);
      } else if (response.data.error) {
        setError(response.data.error);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching tiles by type and company:', err.message);
      setError(err.message);
    }
  };
  
  const handleTypeSelection = (selectedType) => {
    setType(selectedType);
    fetchTilesByTypeAndCompany(selectedType, selectedCompanyId);
  };

  return (
    <div className='catalogue'>
      <div className='right-container'>
        <SearchBar selectedOptions={selectedOptions} />
        <div className="card-container">
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p className="error-message">{error}</p>
  ) : tiles.length > 0 ? (
    tiles.map((tile) => (
      <Card
        key={tile.tile_id}
        name={tile.name}
        company={tile.company_name}
        color={tile.color}
        articleName={tile.name}
        images={tile.images}
        dimensions={tile.sizes}
      />
    ))
  ) : (
    <div className="no-results">
      <img
        src="/assets/no-results-icon.png"
        alt="No Results"
        className="no-results-icon"
      />
      <h3 className="no-results-title">No tiles match your criteria</h3>
      <p className="no-results-message">
        Try adjusting your filters or search criteria to explore more options.
      </p>
    </div>
  )}
</div>
</div>

      <div className='filter-container'>
        <div className='size_label'>النوعية</div>
        <div className='type' onClick={() => toggleDropdown(1)}>
          <input
            className='type-input'
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="اختر النوعية"
          />
          {dropdownVisible === 1 && (
    <div className="dropdown-size-content">
      {types.length > 0 ? (
        types.map((typeOption, index) => (
          <p key={index} onClick={() => handleTypeSelection(typeOption)}>
            {typeOption}
          </p>
        ))
      ) : (
        <p>لا توجد أنواع</p>
      )}
    </div>
  )}
        </div>

        <div className="size_label">الشركة</div>
        <div className="checkbox-list">
        {loading ? (
            <p>Loading...</p>
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <div className="check" key={company.id}>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    value={company.company_name}
                    checked={selectedOptions.company.includes(company.company_name)}
                    onChange={handleCompanyChange}
                  />
                  {company.company_name}
                </label>
              </div>
            ))
          ) : (
            <p>No companies available</p>
          )}
        </div>

        <div className='size_label'>اللون</div>
        <div className='type' onClick={() => toggleDropdown(4)}>
          <input
            className='type-input'
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="اختر اللون"
          />
          {dropdownVisible === 4 && (
            <div className="dropdown-size-content">
              {colors.length > 0 ? (
                colors.map((col, index) => (
                  <p key={index} onClick={() => setColor(col.name)}>
                    {col.name}
                  </p>
                ))
              ) : (
                <p>لا توجد ألوان</p>
              )}
            </div>
          )}
        </div>

        <div className='size_label'>القياس</div>
        <div className='sliders'>
          <div className="slider-container">
            <label>الطول سم</label>
            <ReactSlider
              min={0}
              max={300}
              value={value1}
              onChange={(values) => {
                setValue1(values);
                setSelectedOptions((prevState) => ({
                  ...prevState,
                  dimensions: { ...prevState.dimensions, length: values },
                }));
              }}
              renderTrack={(props) => <div {...props} className="slider-track" />}
              renderThumb={(props) => <div {...props} className="slider-thumb">{props['aria-valuenow']}</div>}
              className="slider"
              step={1}
              pearling
            />
          </div>

          <div className="slider-container">
            <label>العرض سم</label>
            <ReactSlider
              min={0}
              max={300}
              value={value2}
              onChange={(values) => {
                setValue2(values);
                setSelectedOptions((prevState) => ({
                  ...prevState,
                  dimensions: { ...prevState.dimensions, width: values },
                }));
              }}
              renderTrack={(props) => <div {...props} className="slider-track" />}
              renderThumb={(props) => <div {...props} className="slider-thumb">{props['aria-valuenow']}</div>}
              className="slider"
              step={1}
              pearling
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
