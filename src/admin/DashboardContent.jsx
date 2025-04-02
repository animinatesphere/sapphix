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
} from "recharts";
import { FiChevronDown } from "react-icons/fi";
import { BarChart, Bar } from "recharts";
// import { Avatar } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { FiArrowUp, FiArrowDown } from "react-icons/fi";
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
  const [randomMonth, setRandomMONTH] = useState("");
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
        "Ja",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Ju",
        "Jul",
        "Au",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      setRandomMONTH(months[Math.floor(Math.random() * months.length)]);
    };
    generateRandomNumbers();
  }, []);

  return (
    <div className="dashboard-container">
      <Card className="congratulation-card">
        <CardContent>
          <div className="card-content-parent">
            <img src={fire} alt="" className="fire" />
            <div className="card-text">
              <h2>
                Congratulations,<span className="sp">Admin</span>
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
        <div className="line-real">
          <div className="line-parent">
            <div className="line-nav">
              <p className="line-text1">Orders Over Time</p>
              <p className="line-text2">
                Last {random2Digit} Hours <FiChevronDown />
              </p>
            </div>
            <div className="line-nav2">
              <div className="line-nav2-left">
                <div className="line-nav2-text1">
                  <h1>{random3Digit}</h1>
                  <p>orders on {randomMonth} 25</p>
                </div>
                <div className="line-nav2-text1">
                  <h1>{random3Digit}</h1>
                  <p>orders on {randomMonth} 24</p>
                </div>
              </div>
              <div className="lin3-nav2-right">
                <div className="right2-1">
                  <div className="right1-point"></div>
                  <p>
                    {randomMonth} {random2Digit}
                  </p>
                </div>
                <div className="right2-1">
                  <div className="right2-point"></div>
                  <p>
                    {randomMonth} {random2Digit}
                  </p>
                </div>
              </div>
            </div>
            <LineChart
              width={760}
              height={447}
              data={data}
              style={{ paddingLeft: "-5rem" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ordersDay1"
                stroke=" var(--Surface-Default, #F58800"
              />
              <Line type="monotone" dataKey="ordersDay2" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
        <div className="bar-parent">
          <div className="bar-card">
            <p className="bar1">Last {random1Digit} Days Sales</p>
            <h1 className="bar4">
              {random4Digit.toLocaleString()} <p>Items Sold</p>
            </h1>
            <h1 className="bar6">
              {random6Digit.toLocaleString()} <p>Revenue</p>
            </h1>
          </div>
          <BarChart width={240} height={300} data={salesData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1FD286" />
          </BarChart>
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
