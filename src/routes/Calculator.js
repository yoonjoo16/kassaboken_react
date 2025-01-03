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
  Alert,
  Checkbox,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Calculator = () => {
  const [newUser, setNewUser] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);
  const [newSettled, setNewSettled] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [year, setYear] = useState(new Date().getFullYear());

  const [records, setRecords] = useState([]);
  const [sortedRecords, setSortedRecords] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [settlement, setSettlement] = useState({
    commonExpense: 0,
    erikPaid: 0,
    yoonjooPaid: 0,
    debt: 0,
  });

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState("");

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
    setNewUser("");
    setNewCategory("");
    setNewDate(new Date());
    setNewAmount(0);
    setNewSettled(false);
    setNewNote("");
    setEditingRecordId("");
  };

  const getRecords = async () => {
    const dbRecords = await dbService
      .collection(isAdmin ? "calculator" + year : "calculator_guest")
      .get();
    dbRecords.forEach((item) => {
      const recordObj = {
        ...item.data(),
        id: item.id,
      };
      setRecords((prev) => [recordObj, ...prev]);
    });
  };

  const getCashbook = async () => {
    const dbRecords = await dbService
      .collection(isAdmin ? "cashbook" + year : "cashbook_guest")
      .where("settled", "==", false)
      .get();
    dbRecords.forEach((item) => {
      const recordObj = {
        ...item.data(),
        id: item.id,
      };
      setCashbook((prev) => [recordObj, ...prev]);
    });
  };

  useEffect(() => {
    getRecords();
    getCashbook();
    dbService
      .collection(isAdmin ? "calculator" + year : "calculator_guest")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordArray);
      });
  }, []);

  const selectYear = (event) => {
    const {
      target: { value },
    } = event;
    setYear(value);
    dbService
      .collection(isAdmin ? "cashbook" + value : "cashbook_guest")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCashbook(recordArray);
      });
    dbService
      .collection(isAdmin ? "calculator" + value : "calculator_guest")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordArray);
      });
  };

  useEffect(() => {
    calculate();
  }, [year, records, cashbook]);

  const calculate = () => {
    var filteredCashbook = cashbook.filter((obj) => {
      return !obj.settled;
    });
    var filteredRecords = records.filter((obj) => {
      return !obj.settled;
    });
    var yoonjooSpent = 0;
    var erikSpent = 0;
    filteredCashbook.forEach((obj) => {
      if (obj.user == "Yoonjoo") {
        yoonjooSpent += obj.amount;
      } else {
        erikSpent += obj.amount;
      }
    });
    var totalDebt = (erikSpent - yoonjooSpent) / 2;
    filteredRecords.forEach((obj) => {
      if (obj.user == "Yoonjoo") {
        if (obj.category == "debt") {
          totalDebt += obj.amount;
        } else {
          totalDebt -= obj.amount;
        }
      } else {
        if (obj.category == "debt") {
          totalDebt -= obj.amount;
        } else {
          totalDebt += obj.amount;
        }
      }
    });
    var newRecords = records;
    newRecords.sort((a, b) => {
      return b.date - a.date;
    });
    setSortedRecords(newRecords);
    setSettlement({
      commonExpense: (yoonjooSpent + erikSpent) / 2,
      erikPaid: erikSpent,
      yoonjooPaid: yoonjooSpent,
      debt: totalDebt,
    });
  };

  const handleOpen = (mod) => {
    mod == "adding" ? setAddingOpen(true) : setEditingOpen(true);
  };
  const handleClose = (mod) => {
    mod == "adding" ? setAddingOpen(false) : setEditingOpen(false);
    initStates();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const newRecord = {
      user: newUser,
      category: newCategory,
      date: newDate,
      amount: newAmount,
      settled: newSettled,
      note: newNote,
    };
    setYear(newDate.getFullYear());
    await dbService
      .collection(
        isAdmin ? "calculator" + newDate.getFullYear() : "calculator_guest"
      )
      .add(newRecord);
    initStates();
    handleClose("adding");
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    const newRecord = {
      user: newUser,
      category: newCategory,
      date: newDate,
      amount: newAmount,
      settled: newSettled,
      note: newNote,
    };
    setYear(newDate.getFullYear());
    await dbService
      .doc(
        `${
          isAdmin ? "calculator" + newDate.getFullYear() : "calculator_guest"
        }/${editingRecordId}`
      )
      .update(newRecord);
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

  const onSettledChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSettled(value);
  };

  const onCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewCategory(value);
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
        .doc(`${isAdmin ? "calculator" + year : "calculator_guest"}/${id}`)
        .delete();
    }
  };

  const UpdateCheckbox = async (event, record) => {
    event.preventDefault();
    await dbService
      .doc(`${isAdmin ? "calculator" + year : "calculator_guest"}/${record.id}`)
      .update({ settled: !record.settled });
    initStates();
  };

  return (
    <div>
      <Box sx={{ m: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {settlement.debt > 0 && (
              <Alert severity="error">
                Yoonjoo should pay {settlement.debt} kronor!{" "}
              </Alert>
            )}
            {settlement.debt < 0 && (
              <Alert severity="error">
                Erik should pay {settlement.debt * -1} kronor!{" "}
              </Alert>
            )}
            {settlement.debt == 0 && (
              <Alert severity="success">Nothing! </Alert>
            )}
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info">
              The common expense: {settlement.commonExpense} per person <br />
              Erik paid: {settlement.erikPaid} / Yoonjoo paid:
              {settlement.yoonjooPaid}
            </Alert>
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

                  <FormControl margin="normal" style={{ minWidth: 200 }}>
                    <InputLabel id="category-adding-label">Category</InputLabel>
                    <Select
                      labelId="category-adding-label"
                      id="category-adding"
                      value={newCategory}
                      onChange={onCategoryChange}
                      label="category"
                    >
                      <MenuItem value={"debt"}>Debt</MenuItem>
                      <MenuItem value={"swish"}>Swish</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
                  <TextField
                    margin="normal"
                    type="text"
                    label="Note"
                    value={newNote}
                    onChange={onNoteChange}
                  />
                  <FormControl margin="normal">
                    <InputLabel id="settled-adding-label">Settled</InputLabel>
                    <Select
                      labelId="settled-adding-label"
                      id="settled-adding"
                      value={newSettled}
                      onChange={onSettledChange}
                      label="Settled"
                    >
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
                  <TextField margin="normal" type="submit" value="register" />
                </Box>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ my: 1 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "10%" }} align="center">
                        Date
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Name
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Amount
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Category
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Note
                      </TableCell>
                      <TableCell style={{ width: "10%" }} align="center">
                        Settled
                      </TableCell>
                      <TableCell
                        style={{ width: "10%" }}
                        align="center"
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell align="center">
                          <Moment format="YYYY/MM/DD">
                            {record.date.toDate()}
                          </Moment>
                        </TableCell>
                        <TableCell align="center">{record.user}</TableCell>
                        <TableCell align="center">{record.amount}</TableCell>
                        <TableCell align="center">{record.category}</TableCell>
                        <TableCell align="center">{record.note}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={record.settled}
                            onChange={(event) => {
                              UpdateCheckbox(event, record);
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
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
                                setNewCategory(record.category);
                                setNewSettled(record.settled);
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
                                      <MenuItem value={"debt"}>Debt</MenuItem>
                                      <MenuItem value={"swish"}>Swish</MenuItem>
                                    </Select>
                                  </FormControl>

                                  <TextField
                                    margin="normal"
                                    type="text"
                                    label="Note"
                                    value={newNote}
                                    onChange={onNoteChange}
                                  />
                                  <FormControl margin="normal">
                                    <InputLabel id="settled-editing-label">
                                      Settled
                                    </InputLabel>
                                    <Select
                                      labelId="settled-editing-label"
                                      id="settled-editing"
                                      value={newSettled}
                                      onChange={onSettledChange}
                                      label="Settled"
                                    >
                                      <MenuItem value={true}>True</MenuItem>
                                      <MenuItem value={false}>False</MenuItem>
                                    </Select>
                                  </FormControl>

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

export default React.memo(Calculator);
