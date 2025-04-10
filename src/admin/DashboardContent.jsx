import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../admin/Card";
import fire from "../admin/admin-folder/fire.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiChevronDown } from "react-icons/fi";
import { BarChart, Bar } from "recharts";
import "../admin/DashboardContent.css";
import naira from "../admin/admin-folder/naira.png";
import cart from "../admin/admin-folder/Cart (1).png";
import add from "../admin/admin-folder/add.png";
import chart from "../admin/admin-folder/chart.png";

const data = [
  { hour: "4 AM", ordersDay1: 10, ordersDay2: 15 },
  { hour: "6 AM", ordersDay1: 20, ordersDay2: 25 },
  { hour: "8 AM", ordersDay1: 34, ordersDay2: 28 },
  { hour: "10 AM", ordersDay1: 40, ordersDay2: 35 },
  { hour: "12 PM", ordersDay1: 20, ordersDay2: 30 },
  { hour: "2 PM", ordersDay1: 15, ordersDay2: 20 },
];

const salesData = [
  { day: 12, revenue: 100000 },
  { day: 13, revenue: 150000 },
  { day: 14, revenue: 200000 },
  { day: 15, revenue: 250000 },
  { day: 16, revenue: 300000 },
  { day: 17, revenue: 350000 },
];

const DashboardContent = () => {
  const [random6Digit, setRandom6Digit] = useState("");
  const [random1Digit, setRandom1Digit] = useState("");
  const [random2Digit, setRandom2Digit] = useState("");
  const [random3Digit, setRandom3Digit] = useState("");
  const [random4Digit, setRandom4Digit] = useState("");
  const [randomMonth, setRandomMonth] = useState("");

  useEffect(() => {
    const generateRandomNumbers = () => {
      setRandom6Digit(
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      );
      setRandom1Digit(Math.floor(Math.random() * (9 - 1 + 1)) + 1);
      setRandom2Digit(Math.floor(Math.random() * (99 - 10 + 1)) + 10);
      setRandom3Digit(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
      setRandom4Digit(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      setRandomMonth(months[Math.floor(Math.random() * months.length)]);
    };
    generateRandomNumbers();
  }, []);

  return (
    <div className="dashboard-container2">
      <Card className="congratulation-card">
        <CardContent>
          <div className="card-content-parent">
            <img src={fire} alt="" className="fire" />
            <div className="card-text">
              <h2>
                Congratulations, <span className="sp">Admin</span>
              </h2>
              <p className="do">
                You have done{" "}
                <span className="pe">{random2Digit}% more sales</span> today.
                Here is an overview of your records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="stats-section">
        <div className="stat-card">
          <div className="text-in">
            <p>{random6Digit.toLocaleString()}</p>
            <h3>Total Revenue</h3>
            <span>10.24%</span>
          </div>
          <img src={naira} alt="" />
        </div>
        <div className="stat-card">
          <div className="text-in">
            <p>{random4Digit.toLocaleString()}</p>
            <h3>Orders</h3>
            <span>15.45%</span>
          </div>
          <img src={cart} alt="" />
        </div>
        <div className="stat-card">
          <div className="text-in">
            <p>{random2Digit}</p>
            <h3>Refunds</h3>
            <span>2%</span>
          </div>
          <img src={add} alt="" />
        </div>
        <div className="stat-card">
          <div className="text-in">
            <p>{random4Digit.toLocaleString()}</p>
            <h3>New Users</h3>
            <span>21%</span>
          </div>
          <img src={chart} alt="" />
        </div>
      </div>

      <div className="charts-section">
        <div className="line-chart-container">
          <div className="line-header">
            <div className="line-title">
              <p>Orders Over Time</p>
              <div className="period-selector">
                <p>
                  Last {random2Digit} Hours <FiChevronDown />
                </p>
              </div>
            </div>
            <div className="line-stats">
              <div className="stats-group">
                <div className="stat-item">
                  <h3>{random3Digit}</h3>
                  <p>orders on {randomMonth} 25</p>
                </div>
                <div className="stat-item">
                  <h3>{random3Digit}</h3>
                  <p>orders on {randomMonth} 24</p>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color day1"></div>
                  <p>
                    {randomMonth} {random2Digit}
                  </p>
                </div>
                <div className="legend-item">
                  <div className="legend-color day2"></div>
                  <p>
                    {randomMonth} {random2Digit}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ordersDay1"
                  stroke="#F58800"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="ordersDay2" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bar-chart-container">
          <div className="bar-header">
            <p>Last {random1Digit} Days Sales</p>
            <div className="bar-stats">
              <div className="bar-stat-item">
                <h3>{random4Digit.toLocaleString()}</h3>
                <p>Items Sold</p>
              </div>
              <div className="bar-stat-item">
                <h3>{random6Digit.toLocaleString()}</h3>
                <p>Revenue</p>
              </div>
            </div>
          </div>
          <div className="bar-chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1FD286" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="transaction-section">
        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <ul>
            <li>Emery Torff - ₦10,000 - In Process</li>
            <li>Maren Dolakis - ₦8,000 - Withheld</li>
            <li>Cooper Siphon - ₦10,000 - Successful</li>
          </ul>
        </div>

        <div className="best-selling-products">
          <h3>Best Selling Products</h3>
          <ul>
            <li>Afrofusion School Bag - ₦10,000 - 20 Units</li>
            <li>Iro Handbag - ₦20,000 - 14 Units</li>
            <li>Afro-fusion Shirt - ₦15,000 - 24 Units</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
