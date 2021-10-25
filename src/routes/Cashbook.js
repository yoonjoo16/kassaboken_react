import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import Record from "components/Record";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Cashbook = () => {
  const [newUser, setNewUser] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);
  const [records, setRecords] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const newRecord = {
      user: newUser,
      place: newPlace,
      date: newDate,
      amount: newAmount,
    };
    await dbService.collection("cashbook").add(newRecord);
    setNewUser("");
    setNewPlace("");
  };

  const onUserChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewUser(value);
  };

  const onDateChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDate(value);
  };

  const onAmountChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewAmount(Number(value));
  };

  const onPlaceChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewPlace(value);
  };

  const getRecords = async () => {
    const dbRecords = await dbService.collection("cashbook").get();
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
    dbService.collection("cashbook").onSnapshot((snapshot) => {
      const recordArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(recordArray);
    });
  }, []);

  return (
    <div>
      <Box component="form" onSubmit={onSubmit}>
        <FormControl margin="normal">
          <InputLabel id="demo-simple-select-helper-label">User</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={newUser}
            onChange={onUserChange}
            label="user"
          >
            <MenuItem value={"Erik"}>Erik</MenuItem>
            <MenuItem value={"Yoonjoo"}>Yoonjoo</MenuItem>
          </Select>
        </FormControl>
        <FormControl margin="normal">
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              label="Date"
              value={newDate}
              onChange={setNewDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>

        <TextField
          margin="normal"
          type="text"
          label="Amount"
          value={newAmount}
          onChange={onAmountChange}
        />
        <br />
        <TextField
          margin="normal"
          type="text"
          label="Place"
          value={newPlace}
          onChange={onPlaceChange}
        />
        <TextField margin="normal" type="submit" value="register" />
      </Box>
      <div>
        {records.map((record) => (
          <Record key={record.id} recordObj={record} />
        ))}
      </div>
    </div>
  );
};

export default Cashbook;
