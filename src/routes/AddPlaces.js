import React, { useState, useEffect } from "react";
import { dbService } from "fbase";

import {
  Button,
  ButtonGroup,
  TextField,
  Fab,
  Paper,
  Grid,
  Box,
  Modal,
  Icon,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AddPlaces = ({ isAdmin }) => {
  const [places, setPlaces] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState("");
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
    setNewCategory("");
    setNewLabel("");
    setEditingPlaceId("");
  };

  const getPlaces = async () => {
    const dbPlaces = await dbService
      .collection(isAdmin ? "places" : "places2")
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
    getPlaces();
    dbService
      .collection(isAdmin ? "places" : "places2")
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
    mod == "adding" ? setAddingOpen(true) : setEditingOpen(true);
  };
  const handleClose = (mod) => {
    mod == "adding" ? setAddingOpen(false) : setEditingOpen(false);
    initStates();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const newPlace = {
      label: newLabel,
      category: newCategory,
    };
    await dbService.collection(isAdmin ? "places" : "places2").add(newPlace);
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
    await dbService
      .doc(`${isAdmin ? "places" : "places2"}/${editingPlaceId}`)
      .update(newPlace);
    console.log("updated");
    initStates();
    handleClose("editing");
  };

  const onDeleteClick = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`${isAdmin ? "places" : "places2"}/${id}`).delete();
    }
  };

  const columns = [
    {
      field: "category",
      headerName: "Category",
      width: 150,
      editable: false,
    },
    {
      field: "label",
      headerName: "Place",
      width: 150,
      editable: false,
    },

    {
      field: "id",
      headerName: "Option",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <ButtonGroup variant="text" aria-label="text button group">
          {/* Edit modal */}
          <Button
            onClick={(e) => {
              var place = places.find((x) => x.id == params.value);
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

                <TextField margin="normal" type="submit" value="register" />
              </Box>
            </Box>
          </Modal>

          <Button onClick={(e) => onDeleteClick(params.value)}>Delete</Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ m: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justifyContent="flex-end"
          >
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
          <Grid item xs={12}>
            <Paper>
              <DataGrid
                autoHeight
                rows={places}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[15]}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default React.memo(AddPlaces);
