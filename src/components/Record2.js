import { dbService, storageService } from "fbase";
import React, { useState } from "react";
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
import { format } from "date-fns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";

const Record2 = ({ recordObj }) => {
  const [editing, setEditing] = useState(false);
  const [newUser, setNewUser] = useState(recordObj.user);
  const [newPlace, setNewPlace] = useState(recordObj.place);
  const [newDate, setNewDate] = useState(recordObj.date);
  const [newAmount, setNewAmount] = useState(recordObj.amount);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onUserChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewUser(value);
  };

  const onPlaceChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewPlace(value);
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

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`cashbook/${recordObj.id}`).update({
      user: newUser,
      place: newPlace,
      date: newDate,
      amount: newAmount,
    });
    setEditing(false);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`cashbook/${recordObj.id}`).delete();
    }
  };

  return (
    <div>
      {editing ? (
        <>
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

            <TextField margin="normal" type="submit" value="Change" />
          </Box>
          <Button onClick={toggleEditing}>Cancel</Button>
        </>
      ) : (
        <>
          <TableRow>
            <TableCell style={{ width: "25%" }} align="center">
              {recordObj.date.toDate().toDateString()}
            </TableCell>
            <TableCell style={{ width: "25%" }} align="center">
              {recordObj.user}
            </TableCell>
            <TableCell style={{ width: "25%" }} align="center">
              {recordObj.amount}
            </TableCell>
            <TableCell style={{ width: "25%" }} align="center">
              {recordObj.place}
            </TableCell>
            <TableCell style={{ width: "25%" }} align="center">
              <ButtonGroup variant="text" aria-label="text button group">
                <Button onClick={toggleEditing}>Edit</Button>
                <Button onClick={onDeleteClick}>Delete</Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        </>
      )}
    </div>
  );
};

export default Record2;
