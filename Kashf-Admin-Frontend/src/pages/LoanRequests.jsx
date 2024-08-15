import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import "../css/LoanRequests.css";
import Navbar from "../components/Navbar";
import BACKEND_URL from "../constants";

const LoanRequests = () => {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [filteredLoanRequests, setFilteredLoanRequests] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch branches, areas, and loan requests data
    //fetchBranches();
    fetchAreas();
    fetchLoanRequests();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/loanRequestBranches`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
      }
      );
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches data:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/loanRequestAreas`,
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

  const fetchLoanRequests = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/loanRequests`,
        {
            headers: {
              'Authorization': `Bearer ${token}`,
          },
        }
      );
      setLoanRequests(response.data);
      setFilteredLoanRequests(response.data.filter(loanRequest => loanRequest.status === selectedFilter))
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
      setFilteredLoanRequests(loanRequests.filter(loanRequest => loanRequest.area === event.target.value && loanRequest.status === selectedFilter))
    } else {
      console.log("Area not found");
      setSelectedBranch("")
      setFilteredLoanRequests(loanRequests.filter(loanRequest => (loanRequest.status === selectedFilter)))
    }
    
    };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    if (event.target.value !== 'Select Branch') {
    setFilteredLoanRequests(loanRequests.filter(loanRequest => loanRequest.branch === event.target.value && loanRequest.area === selectedArea && loanRequest.status === selectedFilter)) }
    else {
        setFilteredLoanRequests(loanRequests.filter(loanRequest => loanRequest.area === selectedArea && loanRequest.status === selectedFilter))
  
    }
};

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.value);
    setFilteredLoanRequests(loanRequests.filter(loanRequest => loanRequest.status === filter.value))
  };

  const toggleDetails = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };
  
  const filterOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">Loan Requests</p>
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
            {filteredLoanRequests.map((request, index) => (
              <li
                key={request.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#eff3f0",
                }}
              >
                <div
                  className="loan-request"
                  onClick={() => toggleDetails(request.id)}
                >
                  <span>
                    Loan Request {index + 1}: {request.name}
                  </span>
                  <span className="next-page">
                    <i
                      className={`fas ${
                        expandedRequest === request.id
                          ? "fa-angle-down"
                          : "fa-angle-right"
                      }`}
                    ></i>
                  </span>
                </div>
                {expandedRequest === request.id && (
                  <div
                    className="loan-details"
                    style={{
                      maxHeight:
                        expandedRequest === request.id ? "500px" : "0",
                      transition: "max-height 0.3s ease-out",
                    }}
                  >
                    <p>Amount Requested: {request.amountRequested}</p>
                    <p>Date: {request.date}</p>
                    <p>Client Information:</p>
                    <ul>
                      <li>
                        <b>Name:</b> {request.clientInfo.name}
                      </li>
                      <li>
                        <b>CNIC:</b> {request.clientInfo.cnic}
                      </li>
                      <li>
                        <b>Cell Number:</b> {request.clientInfo.cellNumber}
                      </li>
                      <li>
                        <b>Active:</b> {request.clientInfo.activeStatus}
                      </li>
                    </ul>
                    <div className="action-buttons">
                      {selectedFilter === "in_progress" ? (
                        <div>
                          <button className="green-button">Accept</button>
                          <button className="red-button">Reject</button>
                        </div>
                      ) : null}
                      {selectedFilter === "pending" ? (
                        <button className="blue-button">
                          Move to In Progress
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {filteredLoanRequests.length === 0 ? <div style={{marginLeft:"20px"}}
        >No loan requests</div> : null}
      </div>
    </>
  );
};

export default LoanRequests;
