import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
// import "../css/NewPromotion.css";
import Navbar from "../components/Navbar";
import newPromoImg from "../assets/images/new-promotion.png";
import axios from 'axios';
import BACKEND_URL from "../constants";

const NewPromotion = () => {
  const [file, setFile] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);
  const token = localStorage.getItem('token');
  const cities = ["Lahore", "Multan", "Rawalpindi", "Faisalabad"];

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
      setError("")
    } else {
      alert("Please select a valid image file (JPEG or PNG)");
    }
  };

  // Function to handle file deletion
  const handleFileDelete = (event) => {
    event.stopPropagation();
    setFile(null);
  };

  function handleMsgChange(event) {
    setMessage(event.target.value);
    setError("")
  }

  const handleCityChange = (event) => {
    const city = event.target.value;
    const isChecked = event.target.checked;

    setSelectedCities((prevSelectedCities) => {
      if (isChecked) {
        return [...prevSelectedCities, city];
      } else {
        return prevSelectedCities.filter(
          (selectedCity) => selectedCity !== city
        );
      }
    });
    setError("")
  };

  const handleSendClick = () => {
    if (!file || !selectedCities.length || message === "") {
      setError("Text, areas, and image all are required to send a promotion.");
      return;
    }

    setSuccess("Promotion sent successfully")
    setFile(null)
    setMessage("")
    setSelectedCities([])
    setTimeout(() => {
        setSuccess("");
      }, 5000);
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">New Promotion</p>
          <hr />
        </div>
        <div className="new-content">
          <div className="new-left-side">
            <textarea
              className="new-textarea"
              placeholder="Compose your promotional message here..."
              value={message}
              onChange={handleMsgChange}
            />
            <div className="checkboxes">
              {cities.map((city) => (
                <label key={city}>
                  <input
                    type="checkbox"
                    value={city}
                    checked={selectedCities.includes(city)}
                    onChange={handleCityChange}
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>
          <div className="new-right-side">
            <div className="image-container">
              <img src={newPromoImg} alt="Promotion" />
            </div>
            <div
              className="upload-container"
              onClick={() => inputRef.current.click()}
            >
              <>
                <i
                  className="fas fa-upload mr-1"
                  style={{
                    fontSize: "4em",
                    color: "#9A9A9A",
                  }}
                />
                <p className="upload-text">Upload Promotional Image Here</p>
              </>
              {file ? (
                <div className="chosen-file">
                  <span>Chosen file: {file.name}</span>
                  <span
                    className="delete-file"
                    onClick={(event) => handleFileDelete(event)}
                  >
                    ❌
                  </span>
                </div>
              ) : (
                <button className="choose-button">Choose file</button>
              )}
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={inputRef}
              />
            </div>
          </div>
        </div>
        {error && (
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <p className="error-message">{error}</p></div>
        )}
        {success && (
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <p className="success-message">{success}</p></div>
        )}
        <div className="new-button-container">
          <button className="send-button" onClick={handleSendClick}>Send</button>
        </div>
      </div>
    </>
  );
};

export default NewPromotion;
