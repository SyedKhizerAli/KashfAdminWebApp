import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import "../css/LoanRequests.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../constants";
import promoImg from "../assets/images/promotionalpic.png"

const Promotions = () => {
  const [expandedPromotion, setExpandedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [filteredPromotions, setFilteredPromotions] = useState([])
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchAreas()
    fetchPromotions();
  }, []);

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
    const selectedAreaObject = areas.find(area => area.area === event.target.value);

    if (selectedAreaObject) {
      setFilteredPromotions(promotions.filter(loanRequest => loanRequest.area === event.target.value))
    } else {
      console.log("Area not found");
      setFilteredPromotions(promotions)
    }
    
    };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/fetchAreas`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
      }
      );
      setAreas(response.data);
    } catch (error) {
      console.error("Error fetching areas data:", error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const url = BACKEND_URL;
      const response = await axios.get(`${url}/getPromotions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
      }
      );
      setPromotions(response.data);
      setFilteredPromotions(response.data)
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };


  const handleNewClick = () => {
    navigate("/newPromotion");
  };

  const toggleDetails = (id) => {
    setExpandedPromotion(expandedPromotion === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">Promotions</p>
          <hr />
        </div>
        <div className="filters">
          <div className="filter-dropdown">
            <select className="dropdown" value={selectedArea}
              onChange={handleAreaChange}>
              <option>Select Area</option>
              {areas.map((area, index) => (
                <option key={index} value={area.area}>
                  {area.area}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-toggle">
            <button className="toggle selected" onClick={handleNewClick}>
              + New Promotion
            </button>
          </div>
        </div>
        <div className="loan-list">
          <ul>
            {filteredPromotions.map((promotion, index) => (
              <li
                key={promotion.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#eff3f0",
                }}
              >
                <div
                  className="loan-request"
                  onClick={() => toggleDetails(promotion.id)}
                >
                  <span>
                    Promotion {index + 1}: {promotion.area}
                  </span>
                  <span className="next-page">
                    <i
                      className={`fas ${
                        expandedPromotion === promotion.id
                          ? "fa-angle-down"
                          : "fa-angle-right"
                      }`}
                    ></i>
                  </span>
                </div>
                {expandedPromotion === promotion.id && (
                  <div className="loan-details">
                    <p>Date: {promotion.sentDate}</p>
                    <p>Text: {promotion.info.promoText}</p>
                    <p>Image: </p>
                    <div className="image-container">
                      <img src={promoImg} alt="Promo Pic" />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {filteredPromotions.length === 0 ? <div style={{marginLeft:"20px"}}
        >No promotions</div> : null}
      </div>
    </>
  );
};

export default Promotions;
