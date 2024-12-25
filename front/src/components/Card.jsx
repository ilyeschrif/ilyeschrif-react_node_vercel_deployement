import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/card.css";

const Card = ({ name, company, color, articleName, images, sizes, dimensions }) => {
  const navigate = useNavigate();
  console.log(name, company, color, articleName, images, dimensions);

  const handleCardClick = () => {
    navigate("/product", {
      state: { name, company, color, articleName, images },
    });
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      {/* Ensure that images[0] is available before trying to use it */}
      <img
        className="card-image"
        src={images && images.length > 0 ? images[0] : ""}
        alt={images && images.length > 0 ? `Tile: ${articleName} in ${color} color` : "No image available"}
      />
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        {color && <p className="card-detail"><strong>Color:</strong> {color}</p>}
        {articleName && <p className="card-detail"><strong>Article:</strong> {articleName}</p>}
        {company && <p className="card-detail"><strong>Company:</strong> {company}</p>}
        <p className="card-detail"><strong>Dimensions: </strong>{dimensions?.join('  ')} cm</p>
      </div>
      <div className="card-tags">
        <span className="tag">#Porcelain</span>
        <span className="tag">#Marble</span>
        <span className="tag">#Tiles</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string,
  color: PropTypes.string,
  articleName: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,  // Ensure images is an array of strings
  sizes: PropTypes.arrayOf(PropTypes.string),  // Add sizes if used elsewhere
  dimensions: PropTypes.arrayOf(PropTypes.number), // Ensure dimensions is an array of numbers
};

Card.defaultProps = {
  company: "Unknown Company",
  color: "Unknown Color",
  articleName: "Unknown Article",
  images: [],  // Default to an empty array
  sizes: [],
  dimensions: [],
};

export default Card;
