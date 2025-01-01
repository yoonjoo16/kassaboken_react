import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Moment from "react-moment";
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
  InputLabel,
  MenuItem,
  Paper,
  Grid,
  Box,
  Modal,
  Autocomplete,
  Alert,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Calculate } from "@mui/icons-material";

const CommonAccount = () => {
  const [newPlace, setNewPlace] = useState({ label: "", category: "" });
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);
  const [newCategory, setNewCategory] = useState("");
  const [newNote, setNewNote] = useState("");

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const [places, setPlaces] = useState([]);

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState("");

  const [settlement, setSettlement] = useState({
    deposits: 0,
    withdrawals: 0,
    balance: 0,
  });

  var isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fullWidth: true,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const initStates = () => {
    setNewPlace({ label: "", category: "" });
    setNewDate(new Date());
    setNewAmount(0);
    setNewCategory("");
    setNewNote("");
    setEditingRecordId("");
  };

  const getRecords = async () => {
    const dbRecords = await dbService
      .collection(isAdmin ? "common" + year : "common_guest")
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
    const dbPlaces = await dbService
      .collection(isAdmin ? "places" : "places_guest")
      .get();
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
    dbService
      .collection(isAdmin ? "common" + year : "common_guest")
      .onSnapshot((snapshot) => {
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
      return b.date - a.date;
    });
    setSelectedRecords(filtered);
  };

  useEffect(() => {
    calculate();
  }, [selectedRecords]);

  const calculate = () => {
    var totalWithdrawals = 0;
    var totalDeposits = 0;

    selectedRecords.forEach((obj) => {
      if (obj.category == "Withdrawal") {
        totalWithdrawals += obj.amount;
      } else {
        totalDeposits += obj.amount;
      }
    });
    var totalBalance = totalDeposits - totalWithdrawals;
    setSettlement({
      withdrawals: totalWithdrawals,
      deposits: totalDeposits,
      balance: totalBalance,
    });
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
      place: newPlace,
      date: newDate,
      amount: newAmount,
      category: newCategory,
      note: newNote,
    };
    await dbService
      .collection(isAdmin ? "common" + year : "common_guest")
      .add(newRecord);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
    initStates();
    handleClose("adding");
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    const newRecord = {
      place: newPlace,
      date: newDate,
      amount: newAmount,
      category: newCategory,
      note: newNote,
    };
    await dbService
      .doc(`${isAdmin ? "common" + year : "common_guest"}/${editingRecordId}`)
      .update(newRecord);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
    initStates();
    handleClose("editing");
  };

  const onCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewCategory(value);
  };

  const onAmountChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewAmount(Number(value));
  };

  const onNoteChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNote(value);
  };

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService
        .doc(`${isAdmin ? "common" + year : "common_guest"}/${id}`)
        .delete();
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
    dbService
      .collection(isAdmin ? "common" + value : "common_guest")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordArray);
      });
  };

  return (
    <div>
      <Box sx={{ m: 1 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Alert severity="info">
              Deposits : {settlement.deposits} / Withdrawals :{" "}
              {settlement.withdrawals}
            </Alert>
            <Alert severity="success">Balance : {settlement.balance}</Alert>
          </Grid>

          <Grid item xs={8}>
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="selectYear-label">Year</InputLabel>
              <Select
                value={year}
                labelId="selectYear-label"
                label="selectYear"
                onChange={selectYear}
              >
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 80 }}>
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
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={() => handleOpen("adding")}
            >
              Add
            </Button>

            {/* Add modal */}
            <Modal
              open={addingOpen}
              onClose={() => handleClose("adding")}
              aria-labelledby="modal-adding"
            >
              <Box sx={modalStyle}>
                <Box component="form" onSubmit={onSubmit}>
                  <FormControl margin="normal" style={{ minWidth: 200 }}>
                    <InputLabel id="category-adding-label">Category</InputLabel>
                    <Select
                      labelId="category-adding-label"
                      id="category-adding"
                      value={newCategory}
                      onChange={onCategoryChange}
                      label="category"
                    >
                      <MenuItem value={"Deposit"}>Deposit</MenuItem>
                      <MenuItem value={"Withdrawal"}>Withdrawal</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
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

                  <TextField
                    margin="normal"
                    type="text"
                    label="Note"
                    value={newNote}
                    onChange={onNoteChange}
                  />

                  <br />
                  <TextField margin="normal" type="submit" value="register" />
                </Box>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "10%" }} align="center">
                        Date
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Category
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Amount
                      </TableCell>
                      <TableCell style={{ width: "20%" }} align="center">
                        Place
                      </TableCell>
                      <TableCell style={{ width: "20%" }} align="center">
                        Note
                      </TableCell>

                      <TableCell style={{ width: "20%" }} align="center">
                        Edit/Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell align="center">
                          <Moment format="YYYY/MM/DD">
                            {record.date.toDate()}
                          </Moment>
                        </TableCell>
                        <TableCell align="center">{record.category}</TableCell>
                        <TableCell align="center">{record.amount}</TableCell>
                        <TableCell align="center">
                          {record.place.label}
                        </TableCell>
                        <TableCell align="center">{record.note}</TableCell>
                        <TableCell align="center">
                          <ButtonGroup
                            variant="text"
                            aria-label="text button group"
                          >
                            {/* Edit modal */}
                            <Button
                              onClick={(e) => {
                                setEditingRecordId(record.id);
                                setNewAmount(record.amount);
                                setNewDate(record.date.toDate());
                                setNewPlace(record.place);
                                setNewCategory(record.category);
                                setNewNote(record.note);
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
                                    <InputLabel id="category-editing-label">
                                      Category
                                    </InputLabel>
                                    <Select
                                      labelId="category-editing-label"
                                      id="category-editing"
                                      value={newCategory}
                                      onChange={onCategoryChange}
                                      label="category"
                                    >
                                      <MenuItem value={"Deposit"}>
                                        Deposit
                                      </MenuItem>
                                      <MenuItem value={"Withdrawal"}>
                                        Withdrawal
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <br />
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

                                  <Autocomplete
                                    disablePortal
                                    options={places}
                                    sx={{ width: 200 }}
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
                                    type="text"
                                    label="Note"
                                    value={newNote}
                                    onChange={onNoteChange}
                                  />
                                  <TextField
                                    margin="normal"
                                    type="submit"
                                    value="Update"
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
        </Grid>
      </Box>
    </div>
  );
};

export default React.memo(CommonAccount);
