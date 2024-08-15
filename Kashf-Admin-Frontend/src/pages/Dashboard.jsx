import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from 'axios';
import BACKEND_URL from "../constants";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);


const Dashboard = () => {

  const [complaintsDataForLC, setComplaintsDataForLC] = useState([]);
  const [loanDataForLC, setLoanDataForLC] = useState([]);
  const token = localStorage.getItem('token');
  
  const navigate = useNavigate();
//   const [loanReqs, setLoanReqs] = useState([]);
//   const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if(!token)
    {
      navigate('/');
    }
    else {
      // Fetch complaints data
    fetchComplaintsData();
    // fetchComplaintsDonutData()
    // Fetch loan data
    fetchLoanData();
    // fetchLoanDonutData()
    }
    
  }, []);

  const fetchComplaintsData = async () => {
    try {
      const url = BACKEND_URL;
      const response = await axios.get(`${url}/dashboardComplaintDetails`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
        }
      );
      setComplaintsDataForLC(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching complaints data:', error);
    }
  };

//   const fetchComplaintsDonutData = async () => {
//     try {
//       const url = BACKEND_URL;
//       const response = await axios.get(`${url}/user/dashboardComplaintDonut`);
//       setComplaints(response.data);
//       console.log(response.data)
//     } catch (error) {
//       console.error('Error fetching complaints data:', error);
//     }
//   };

  const fetchLoanData = async () => {
    try {
      const url = BACKEND_URL;
      console.log('token----',token);
      const response = await axios.get(`${url}/dashboardLoanDetails`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
        },
        }
      );
      setLoanDataForLC(response.data);
      console.log('Loan Data--',response.data)
    } catch (error) {
      console.error('Error fetching loan data:', error);
    }
  };

//   const fetchLoanDonutData = async () => {
//     try {
//       const url = BACKEND_URL;
//       const response = await axios.get(`${url}/user/dashboardLoanDonut`);
//       setLoanDataForLC(response.data);
//       console.log(response.data)
//     } catch (error) {
//       console.error('Error fetching loan data:', error);
//     }
//   };

  const dataComplaintsLC = {
    labels: complaintsDataForLC.map((item) => item.month),
    datasets: [
      {
        label: "Total Complaints",
        data: complaintsDataForLC.map((item) => item.count),
        borderColor: "#508760",
        fill: false,
      },
    ],
  };

  const optionsCLC = {
    scales: {
      x: {
        type: "category",
      },
      y: {
        type: "linear",
      },
    },
  };

  const dataLoanLC = {
    labels: loanDataForLC.map((item) => item.month),
    datasets: [
      {
        label: "Total Loan Requests",
        data: loanDataForLC.map((item) => item.count),
        borderColor: "#508760",
        fill: false,
      },
    ],
  };

  const optionsLLC = {
    scales: {
      x: {
        type: "category",
      },
      y: {
        type: "linear",
      },
    },
  };

  const pluginsLoanChart = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = "bold " + fontSize + "em sans-serif";
        ctx.fillStyle = "#508760";
        ctx.textBaseline = "top";
        var text = "110",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.45;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];

  const pluginsComplaintsChart = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = "bold " + fontSize + "em sans-serif";
        ctx.fillStyle = "#508760";
        ctx.textBaseline = "top";
        var text = "50",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.8;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];

  const darkPastelColors = [
    "#FFA07A", // Light Salmon
    "#FFB6C1", // Light Pink
    "#87CEFA", // Light Sky Blue
    "#ABEBC6",
    "#def08c",
    "#caccfc", // Pale Green
    "#66CDAA", // Medium Aquamarine
    "#87CEEB", // Sky Blue
    "#F0E68C", // Khaki
  ];

  let complaintsData = [
    {
      label: "Unsatisfactory BDO Behavior",
      value: 25,
      color: darkPastelColors[0],
      cutout: "50%",
    },
    {
      label: "Branch Manager Behavior Issues",
      value: 5,
      color: darkPastelColors[1],
      cutout: "10%",
    },
    {
      label: "Loan Amount Issues",
      value: 8,
      color: darkPastelColors[2],
      cutout: "16%",
    },
    {
      label: "Unsatisfactory Branch Environment",
      value: 10,
      color: darkPastelColors[3],
      cutout: "20%",
    },
    {
      label: "Other complaint",
      value: 2,
      color: darkPastelColors[5],
      cutout: "4%",
    },
  ];

  let loanReqData = [
    {
      label: "KASHF KAROBAR KARZA",
      value: 25,
      color: darkPastelColors[0],
      cutout: "22.72%",
    },
    {
      label: "KASHF SCHOOL SARMAYA",
      value: 15,
      color: darkPastelColors[1],
      cutout: "13.64%",
    },
    {
      label: "KASHF EASY LOAN",
      value: 7,
      color: darkPastelColors[2],
      cutout: "6.36%",
    },
    {
      label: "KASHF MAHWESHI KARZA",
      value: 10,
      color: darkPastelColors[3],
      cutout: "9.1%",
    },
    {
      label: "KASHF MARHABA PRODUCT",
      value: 2,
      color: darkPastelColors[4],
      cutout: "1.82%",
    },
    {
      label: "KASHF SAHULAT KARZA",
      value: 11,
      color: darkPastelColors[5],
      cutout: "10%",
    },
    {
      label: "KASHF MAWESHI MURAHABA",
      value: 20,
      color: darkPastelColors[6],
      cutout: "18.18%",
    },
    {
      label: "KASHF TOP-UP LOAN",
      value: 15,
      color: darkPastelColors[7],
      cutout: "13.63%",
    },
    {
      label: "HOME IMPROVEMENT LOAN (HIL)",
      value: 5,
      color: darkPastelColors[8],
      cutout: "4.55%",
    },
  ];

  const complaintsOptions = {
    plugins: {
      responsive: true,
    },
    cutout: complaintsData.map((item) => item.cutout),
  };

  const loanReqsOptions = {
    plugins: {
      responsive: true,
    },
    cutout: "50%",
    // cutout: loanReqData.map((item) => item.cutout),
  };

  const finalComplaintsData = {
    labels: complaintsData.map((item) => item.label),
    datasets: [
      {
        data: complaintsData.map((item) => Math.round(item.value)),
        backgroundColor: complaintsData.map((item) => item.color),
        borderColor: complaintsData.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(complaintsData.length).fill(true),
      },
    ],
  };

  const finalLoanReqsData = {
    labels: loanReqData.map((item) => item.label),
    datasets: [
      {
        data: loanReqData.map((item) => Math.round(item.value)),
        backgroundColor: loanReqData.map((item) => item.color),
        borderColor: loanReqData.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(loanReqData.length).fill(true),
      },
    ],
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">Dashboard</p>
          <hr />
        </div>
      </div>
      <div className="dash-content">
        <div className="dash-left-side">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <b>Complaints Overview</b>
            <br />
            <br />
            <Doughnut
              data={finalComplaintsData}
              options={complaintsOptions}
              className="doughnut-chart"
              plugins={pluginsComplaintsChart}
            />{" "}
          </div>
          <Line data={dataComplaintsLC} options={optionsCLC} className="line-chart" />
        </div>
        <div className="dash-right-side">
        <Line data={dataLoanLC} options={optionsLLC} className="line-chart" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <b>Loan Requests Overview</b>
          <br />
          <br />
          <Doughnut
            data={finalLoanReqsData}
            options={loanReqsOptions}
            className="doughnut-chart"
            plugins={pluginsLoanChart}
          />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
