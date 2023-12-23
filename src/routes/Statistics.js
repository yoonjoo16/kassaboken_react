import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "@mui/material";
import { dbService } from "fbase";

const Statistics = () => {
  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedRecords, setSelectedRecords] = useState([]);
  var isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));

  const initStates = () => {};

  const getRecords = async () => {
    const dbRecords = await dbService
      .collection(isAdmin ? "cashbook" : "cashbook2")
      .get();
    dbRecords.forEach((item) => {
      const recordObj = {
        ...item.data(),
        id: item.id,
      };
      setRecords((prev) => [recordObj, ...prev]);
    });
  };

  useEffect(() => {
    getRecords();
    dbService
      .collection(isAdmin ? "cashbook" : "cashbook2")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordArray);
      });
  }, []);

  const data = {
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  };

  return (
    <div class="col-12 col-sm-6">
      <Card>
        <h5>First Line Chart</h5>
        <ReactApexChart
          options={data.options}
          series={data.series}
          type="line"
          height={350}
        />
      </Card>
    </div>
  );
};

export default Statistics;
