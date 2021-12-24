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

const AddPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState("");

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
    setNewCategory("");
    setNewLabel("");
    setEditingPlaceId("");
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
    getPlaces();
    dbService
      .collection("places")
      .orderBy("category")
      .onSnapshot((snapshot) => {
        const recordArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaces(recordArray);
      });
  }, []);

  const onCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewCategory(value);
  };

  const onLabelChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewLabel(value);
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
    const newPlace = {
      label: newLabel,
      category: newCategory,
    };
    await dbService.collection("places").add(newPlace);
    console.log("added");
    initStates();
    handleClose("adding");
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    const newPlace = {
      label: newLabel,
      category: newCategory,
    };
    await dbService.doc(`places/${editingPlaceId}`).update(newPlace);
    console.log("updated");
    initStates();
    handleClose("editing");
  };

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`places/${id}`).delete();
    }
  };

  return (
    <div>
      <h1>Let's add places!!!</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25%" }} align="center">
                        Category
                      </TableCell>
                      <TableCell style={{ width: "50%" }} align="center">
                        Name
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="center">
                        Edit/Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {places.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell style={{ width: "25%" }} align="center">
                          {place.category}
                        </TableCell>
                        <TableCell style={{ width: "50%" }} align="center">
                          {place.label}
                        </TableCell>
                        <TableCell style={{ width: "25%" }} align="center">
                          <ButtonGroup
                            variant="text"
                            aria-label="text button group"
                          >
                            {/* Edit modal */}
                            <Button
                              onClick={(e) => {
                                setEditingPlaceId(place.id);
                                setNewLabel(place.label);
                                setNewCategory(place.category);
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
                                  <TextField
                                    margin="normal"
                                    type="text"
                                    label="category"
                                    value={newCategory}
                                    onChange={onCategoryChange}
                                  />

                                  <TextField
                                    margin="normal"
                                    type="text"
                                    label="place"
                                    value={newLabel}
                                    onChange={onLabelChange}
                                  />

                                  <TextField
                                    margin="normal"
                                    type="submit"
                                    value="register"
                                  />
                                </Box>
                              </Box>
                            </Modal>

                            <Button onClick={(e) => onDeleteClick(place.id)}>
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
                  <TextField
                    margin="normal"
                    type="text"
                    label="category"
                    value={newCategory}
                    onChange={onCategoryChange}
                  />

                  <TextField
                    margin="normal"
                    type="text"
                    label="place"
                    value={newLabel}
                    onChange={onLabelChange}
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

export default AddPlaces;
