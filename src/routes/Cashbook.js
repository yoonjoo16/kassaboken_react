import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import {
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  Fab,
  Paper,
  Grid,
  Box,
  Container,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import AddIcon from "@mui/icons-material/Add";

const Cashbook = () => {
  const [newUser, setNewUser] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState("2021");
  const [month, setMonth] = useState("12");

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState("");

  const modalStyle = {
    position: "absolute",
    top: "20%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const initStates = () => {
    setNewUser("");
    setNewPlace("");
    setNewDate(new Date());
    setNewAmount(0);
    setEditingRecordId("");
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

  const handleOpen = (mod) => {
    if (mod == "adding") {
      setAddingOpen(true);
    } else {
      setEditingOpen(true);
    }
  };
  const handleClose = (mod) => {
    if (mod == "adding") {
      setAddingOpen(false);
    } else {
      setEditingOpen(false);
    }
    initStates();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const newRecord = {
      user: newUser,
      place: newPlace,
      date: newDate,
      amount: newAmount,
    };
    await dbService.collection("cashbook").add(newRecord);
    console.log("added");
    initStates();
    handleClose("adding");
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    await dbService.doc(`cashbook/${editingRecordId}`).update({
      user: newUser,
      place: newPlace,
      date: newDate,
      amount: newAmount,
    });
    console.log("updated");
    initStates();
    handleClose("editing");
  };

  const onUserChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewUser(value);
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

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`cashbook/${id}`).delete();
    }
  };

  const selectMonth = (event) => {
    const {
      target: { value },
    } = event;
    setMonth(value);
  };

  const selectYear = (event) => {
    const {
      target: { value },
    } = event;
    setYear(value);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="selectYear-label">Year</InputLabel>
          <Select
            value={year}
            labelId="selectYear-label"
            label="selectYear"
            onChange={selectYear}
          >
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
            <MenuItem value="2019">2019</MenuItem>
          </Select>
        </FormControl>
        <ToggleButtonGroup
          value={month}
          exclusive
          onChange={selectMonth}
          aria-label="selectMonth"
          sx={{ m: 2, minWidth: 80 }}
        >
          <ToggleButton value="01">1</ToggleButton>
          <ToggleButton value="02">2</ToggleButton>
          <ToggleButton value="03">3</ToggleButton>
          <ToggleButton value="04">4</ToggleButton>
          <ToggleButton value="05">5</ToggleButton>
          <ToggleButton value="06">6</ToggleButton>
          <ToggleButton value="07">7</ToggleButton>
          <ToggleButton value="08">8</ToggleButton>
          <ToggleButton value="09">9</ToggleButton>
          <ToggleButton value="10">10</ToggleButton>
          <ToggleButton value="11">11</ToggleButton>
          <ToggleButton value="12">12</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25%" }} align="center">
                        Date
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="center">
                        Name
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="center">
                        Amount
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="center">
                        Place
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="center">
                        Edit/Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell style={{ width: "25%" }} align="center">
                          {record.date.toDate().toDateString()}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="center">
                          {record.user}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="center">
                          {record.amount}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="center">
                          {record.place}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="center">
                          <ButtonGroup
                            variant="text"
                            aria-label="text button group"
                          >
                            {/* Edit modal */}
                            <Button
                              onClick={(e) => {
                                setEditingRecordId(record.id);
                                setNewUser(record.user);
                                setNewAmount(record.amount);
                                setNewDate(record.date.toDate());
                                setNewPlace(record.place);
                                handleOpen("editing");
                              }}
                            >
                              Edit
                            </Button>
                            <Modal
                              open={editingOpen}
                              onClose={() => handleClose("editing")}
                              aria-labelledby="modal-editing"
                            >
                              <Box sx={modalStyle}>
                                <Box component="form" onSubmit={onUpdate}>
                                  <FormControl margin="normal">
                                    <InputLabel id="editing-simple-select-helper-label">
                                      User
                                    </InputLabel>
                                    <Select
                                      labelId="editing-simple-select-helper-label"
                                      id="editing-simple-select-helper"
                                      value={newUser}
                                      onChange={onUserChange}
                                      label="user"
                                    >
                                      <MenuItem value={"Erik"}>Erik</MenuItem>
                                      <MenuItem value={"Yoonjoo"}>
                                        Yoonjoo
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <FormControl margin="normal">
                                    <LocalizationProvider
                                      dateAdapter={DateAdapter}
                                    >
                                      <DatePicker
                                        label="Date"
                                        value={newDate}
                                        onChange={setNewDate}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
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
                                  <TextField
                                    margin="normal"
                                    type="submit"
                                    value="register"
                                  />
                                </Box>
                              </Box>
                            </Modal>

                            <Button onClick={(e) => onDeleteClick(record.id)}>
                              Delete
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => handleOpen("adding")}
            >
              <AddIcon />
            </Fab>
            {/* Add modal */}
            <Modal
              open={addingOpen}
              onClose={() => handleClose("adding")}
              aria-labelledby="modal-adding"
            >
              <Box sx={modalStyle}>
                <Box component="form" onSubmit={onSubmit}>
                  <FormControl margin="normal">
                    <InputLabel id="adding-simple-select-helper-label">
                      User
                    </InputLabel>
                    <Select
                      labelId="adding-simple-select-helper-label"
                      id="adding-simple-select-helper"
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
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Cashbook;
