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
  Autocomplete,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AddIcon from "@mui/icons-material/Add";

const Cashbook = () => {
  const [newUser, setNewUser] = useState("");
  const [newPlace, setNewPlace] = useState({ label: "", category: "" });
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const [places, setPlaces] = useState([]);

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
    setNewPlace({ label: "", category: "" });
    setNewDate(new Date());
    setNewAmount(0);
    setEditingRecordId("");
  };

  const getRecords = async () => {
    const dbRecords = await dbService
      .collection("cashbook2")
      .orderBy("category")
      .get();
    dbRecords.forEach((item) => {
      const recordObj = {
        ...item.data(),
        id: item.id,
      };
      setRecords((prev) => [recordObj, ...prev]);
    });
  };

  const getPlaces = async () => {
    const dbPlaces = await dbService.collection("places").get();
    dbPlaces.forEach((item) => {
      const placeObj = {
        ...item.data(),
        id: item.id,
      };
      setPlaces((prev) => [placeObj, ...prev]);
    });
  };

  useEffect(() => {
    getRecords();
    getPlaces();
    dbService.collection("cashbook2").onSnapshot((snapshot) => {
      const recordArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(recordArray);
    });
  }, []);

  useEffect(() => {
    selectRecordsByMonth();
  }, [year, month, records]);

  const selectRecordsByMonth = () => {
    var startDate = new Date(year, month - 1, 1); //month starts from 0
    var endDate = new Date(year, month, 0, 23, 59, 59);
    var filtered = records.filter((obj) => {
      return obj.date.toDate() >= startDate && obj.date.toDate() <= endDate;
    });
    filtered.sort((a, b) => {
      return a.date - b.date;
    });
    setSelectedRecords(filtered);
  };

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
    await dbService.collection("cashbook2").add(newRecord);
    console.log("added");
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
    initStates();
    handleClose("adding");
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    const newRecord = {
      user: newUser,
      place: newPlace,
      date: newDate,
      amount: newAmount,
    };
    await dbService.doc(`cashbook2/${editingRecordId}`).update(newRecord);
    console.log("updated");
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
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

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`cashbook2/${id}`).delete();
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
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2019}>2019</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="selectMonth-label">Month</InputLabel>
          <Select
            value={month}
            labelId="selectMonth-label"
            label="selectMonth"
            onChange={selectMonth}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
          </Select>
        </FormControl>
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
                    {selectedRecords.map((record) => (
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
                          {record.place.label}
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
                                  <Autocomplete
                                    disablePortal
                                    options={places}
                                    sx={{ width: 300 }}
                                    defaultValue={newPlace}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(event, value) =>
                                      setNewPlace(value)
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} label="Place" />
                                    )}
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

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={places}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => setNewPlace(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Place" />
                    )}
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
