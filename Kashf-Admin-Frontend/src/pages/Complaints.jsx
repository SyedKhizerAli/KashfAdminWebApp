import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import "../css/LoanRequests.css";
import Navbar from "../components/Navbar";
import axios from 'axios';
import BACKEND_URL from "../constants";

const Complaints = () => {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Fetch branches, areas, and loan requests data
    // fetchBranches();
    fetchAreas();
    fetchComplaints();
  }, []);

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

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/fetchComplaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
      }
      );
      setComplaints(response.data);
      setFilteredComplaints(response.data.filter(loanRequest => loanRequest.status === selectedFilter))
    } catch (error) {
      console.error("Error fetching loan requests data:", error);
    }
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
    const selectedAreaObject = areas.find(area => area.area === event.target.value);

    if (selectedAreaObject) {
      const branches = selectedAreaObject.branches;
      setBranches(branches)
      console.log(branches);
      setFilteredComplaints(complaints.filter(loanRequest => loanRequest.area === event.target.value && loanRequest.status === selectedFilter))
    } else {
      console.log("Area not found");
      setSelectedBranch("")
      setFilteredComplaints(complaints.filter(loanRequest => (loanRequest.status === selectedFilter)))
    }
    
    };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    if (event.target.value !== 'Select Branch') {
        setFilteredComplaints(complaints.filter(loanRequest => loanRequest.branch === event.target.value && loanRequest.area === selectedArea && loanRequest.status === selectedFilter)) }
        else {
            setFilteredComplaints(complaints.filter(loanRequest => loanRequest.area === selectedArea && loanRequest.status === selectedFilter))
      
    }
};

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.value);
    setFilteredComplaints(complaints.filter(loanRequest => loanRequest.status === filter.value))
  };

  const filterOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

  //   const toggleAudio = () => {
  //     const audio = document.getElementById('audio');
  //     if (audio.paused) {
  //       audio.play();
  //     } else {
  //       audio.pause();
  //     }
  //   };


  const toggleDetails = (complaintId) => {
    setExpandedComplaint(
      expandedComplaint === complaintId ? null : complaintId
    );
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">Complaints</p>
          <hr />
        </div>
        <div className="filters">
          <div className="filter-dropdown">
            <select
              className="dropdown"
              value={selectedArea}
              onChange={handleAreaChange}
            >
              <option>Select Area</option>
              {areas.map((area, index) => (
                <option key={index} value={area.area}>
                  {area.area}
                </option>
              ))}
            </select>
            <select
              className="dropdown"
              value={selectedBranch}
              onChange={handleBranchChange}
            >
              <option>Select Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-toggle">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                className={`toggle ${
                  selectedFilter === filter.value ? "selected" : ""
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="loan-list">
          <ul>
            {filteredComplaints.map((complaint, index) => (
              <li
                key={complaint.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#eff3f0",
                }}
              >
                <div
                  className="loan-request"
                  onClick={() => toggleDetails(complaint.id)}
                >
                  <span>
                    Complaint {index + 1}: {complaint.name}
                  </span>
                  <span className="next-page">
                    <i
                      className={`fas ${
                        expandedComplaint === complaint.id
                          ? "fa-angle-down"
                          : "fa-angle-right"
                      }`}
                    ></i>
                  </span>
                </div>
                {expandedComplaint === complaint.id && (
                  <div className="complaint-details">
                    <div className="complaint-details-text">
                      Complaint Type: {complaint.complaintType}
                    </div>
                    <div className="complaint-details-text">
                      Complaint Lodged On: {complaint.complaintLodgedOn}
                    </div>
                    <div className="complaint-details-text">
                      Client Information:
                    </div>
                    <ul>
                      <li>
                        <b>Name:</b> {complaint.clientInfo.name}
                      </li>
                      <li>
                        <b>CNIC:</b> {complaint.clientInfo.cnic}
                      </li>
                      <li>
                        <b>Cell Number:</b> {complaint.clientInfo.cellNumber}
                      </li>
                      <li>
                        <b>Active:</b> {complaint.clientInfo.activeStatus}
                      </li>
                    </ul>
                    {complaint.complaintType === "کوئی اور شکایت" ? (
                      <>
                        {complaint.complaintText !== "" ? <div className="complaint-details-text">
                          Complaint Text: {complaint.complaintText} </div>: null }
                        {complaint.complaintAudio !== "" ? <div className="complaint-details-text">
                          Complaint Audio:{" "}
                          <audio id={"audio"} controls>
                            <source
                              src={complaint.complaintAudio}
                              type="audio/mp3"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div> : null }
                      </>
                    ) : null}
                    <div className="action-buttons">
                      {selectedFilter === "pending" ? (
                        <button className="blue-button">
                          Move to In Progress
                        </button>
                      ) : null}
                      {selectedFilter === "in_progress" ? (
                        <button className="green-button">Resolve</button>
                      ) : null}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {filteredComplaints.length === 0 ? <div style={{marginLeft:"20px"}}
        >No complaints</div> : null}
      </div>
    </>
  );
};

export default Complaints;
