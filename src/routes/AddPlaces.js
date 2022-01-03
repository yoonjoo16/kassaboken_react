import React, { useState, useEffect } from "react";
import { dbService } from "fbase";

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
  Fab,
  Paper,
  Grid,
  Box,
  Modal,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const AddPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlaces, setSelectedPlaces] = useState([]);

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

  useEffect(() => {
    setCategories([...new Set(places.map((x) => x.category))]);
  }, [places]);

  useEffect(() => {
    if (selectedCategory == "All") {
      setSelectedPlaces(places);
    } else {
      setSelectedPlaces(places.filter((x) => x.category == selectedCategory));
    }
  }, [selectedCategory]);

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

  const selectCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(value);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="selectedCategory-label">Category</InputLabel>
          <Select
            value={selectedCategory}
            labelId="selectedCategory-label"
            label="Category"
            onChange={selectCategory}
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem value={cat}>{cat}</MenuItem>
            ))}
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
                    {selectedPlaces.map((place) => (
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
