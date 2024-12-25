import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/productPage.css";

const ProductPage = () => {
  const { state } = useLocation();
  const { name, company, color, articleName, images } = state || {}; 
  // Default fallback data
  const defaultData = {
    name: "منتج افتراضي",
    company: "شركة غير معروفة",
    color: "لون غير معروف",
    articleName: "مقالة غير معروفة",
    images: [], 
  };

  const productName = name || defaultData.name;
  const productCompany = company || defaultData.company;
  const productColor = color || defaultData.color;
  const productArticleName = articleName || defaultData.articleName;
  const productImages = images && images.length > 0 ? images : defaultData.images; 

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="product-container">
          {/* Product Images */}
          <div className="product-images">
            {productImages.length > 0 ? (
              <>
                <img
                  src={productImages[0]}
                  alt={`الصورة الرئيسية لـ ${productName}`}
                  className="main-image"
                />
                <div className="thumbnail-container">
                  {productImages.slice(1).map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`الصورة المصغرة ${index + 1} لـ ${productName}`}
                      className="thumbnail"
                    />
                  ))}
                </div>
              </>
            ) : (
              <p>لا توجد صور لهذا المنتج</p>
            )}
          </div>

          <div className="product-details">
            <h2 className="product-title">{`الاسم: ${productName}`}</h2>
            <p className="product-description">{`المقالة: ${productArticleName}`}</p>
            <p className="product-company">{`الشركة: ${productCompany}`}</p>
            <p className="product-color">{`اللون: ${productColor}`}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
