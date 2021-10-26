import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import Record from "components/Record2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ButtonGroup from "@mui/material/ButtonGroup";
import { positions } from "@mui/system";

const Cashbook = () => {
  const [newUser, setNewUser] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newAmount, setNewAmount] = useState(0);
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "20%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
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
    setNewUser("");
    setNewPlace("");
    setNewDate(new Date());
    setNewAmount(0);
    handleClose();
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

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`cashbook/${id}`).delete();
    }
  };

  return (
    <div>
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
                            <Button onClick={handleOpen}>Edit</Button>
                            <Modal
                              open={open}
                              onClose={handleClose}
                              aria-labelledby="modal-adding"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={modalStyle}>
                                <Box component="form" onSubmit={onSubmit}>
                                  <FormControl margin="normal">
                                    <InputLabel id="demo-simple-select-helper-label">
                                      User
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-helper-label"
                                      id="demo-simple-select-helper"
                                      value={record.user}
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
                                        value={record.date}
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
                                    value={record.amount}
                                    onChange={onAmountChange}
                                  />
                                  <br />
                                  <TextField
                                    margin="normal"
                                    type="text"
                                    label="Place"
                                    value={record.place}
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
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
              <AddIcon />
            </Fab>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-adding"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Box component="form" onSubmit={onSubmit}>
                  <FormControl margin="normal">
                    <InputLabel id="demo-simple-select-helper-label">
                      User
                    </InputLabel>
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
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Cashbook;
