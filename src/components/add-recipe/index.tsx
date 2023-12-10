import ResponsiveAppBar from "@/components/header";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  OutlinedInput,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DropzoneUploader from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddRecipeComponent = () => {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fields, setFields] = useState([
    { title: "", quantity: "" }, // Initial fields
  ]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };
  const handleChangeIngredientsFields = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };
  const handleAddField = () => {
    setFields([...fields, { title: "", quantity: "" }]);
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === "done" && file) {
      setUploadedFiles([...uploadedFiles, file]);
    } else if (status === "removed") {
      let newArr = uploadedFiles.filter((item) => item !== file);
      setUploadedFiles(newArr);
    }
  };
  return (
    <Grid container pt={2}>
      <Grid item xs={0} sm={1}></Grid>
      <Grid item xs={12} sm={5}>
        <Box p={3}>
          <Typography variant="subtitle2" mb={1}>
            Enter Title{" "}
          </Typography>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            fullWidth
          />
          <Typography variant="subtitle2" mt={1} mb={1}>
            Enter Description{" "}
          </Typography>
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            fullWidth
          />
          <Typography variant="subtitle2" mt={1} mb={1}>
            Enter Cooking Instructions
          </Typography>
          <TextField
            id="outlined-basic"
            label="Cooking Instructions"
            variant="outlined"
            fullWidth
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="subtitle2" mt={1} mb={1}>
                Prep Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    // label="Time"
                    //   classes={{
                    //     root: classes.timePickerRoot,
                    //   }}
                    //   style={{ width: "100%" }}
                    //   value={dayjs(dateValue)}
                    // disablePast
                    // use12Hours
                    ampm={false}
                    //   disabled={isEditable}
                    // minTime={new Date(item?.openTimesValueMerged)}
                    // minTime={new Date(0, 0, 0, 12)}
                    onChange={(e) => {
                      // handleChangeDateValue(e, parent, subParent, displayName);
                      // setDateValue(e);
                      /*  if (e == null) {
                    setCloseTimesError(true);
                  } else {
                    setCloseTimesError(false);
                  } */
                    }}
                    renderInput={(params) => (
                      <TextField {...params} style={{ width: "100%" }} />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box>
              <Typography variant="subtitle2" mt={1} mb={1}>
                Cooking Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    // label="Time"
                    //   classes={{
                    //     root: classes.timePickerRoot,
                    //   }}
                    //   style={{ width: "100%" }}
                    //   value={dayjs(dateValue)}
                    // disablePast
                    // use12Hours
                    ampm={false}
                    //   disabled={isEditable}
                    // minTime={new Date(item?.openTimesValueMerged)}
                    // minTime={new Date(0, 0, 0, 12)}
                    onChange={(e) => {
                      // handleChangeDateValue(e, parent, subParent, displayName);
                      // setDateValue(e);
                      /*  if (e == null) {
                    setCloseTimesError(true);
                  } else {
                    setCloseTimesError(false);
                  } */
                    }}
                    renderInput={(params) => (
                      <TextField {...params} style={{ width: "100%" }} />
                    )}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
          </Box>
          <Typography variant="subtitle2" mt={1} mb={1}>
            Select Categories
          </Typography>
          <Select
            labelId="demo-multiple-name-label"
            //   id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Categories" />}
            MenuProps={MenuProps}
            fullWidth
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle2" mt={1} mb={1}>
            Select tags
          </Typography>
          <Select
            labelId="demo-multiple-name-label"
            //   id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Categories" />}
            MenuProps={MenuProps}
            fullWidth
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
      <Grid item xs={12} sm={5}>
        <Box p={3}>
          <Typography variant="h6" mb={1}>
            Ingredients
          </Typography>

          <div>
            {fields.map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Box>
                  {/* <Typography variant="subtitle2" mt={1} mb={1}>
                      Name
                    </Typography> */}
                  <TextField
                    id={`title-${index}`}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={field.title}
                    onChange={(e) =>
                      handleChangeIngredientsFields(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />
                </Box>
                <Box>
                  {/* <Typography variant="subtitle2" mt={1} mb={1}>
                      Quantity
                    </Typography> */}
                  <TextField
                    id={`quantity-${index}`}
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    value={field.quantity}
                    onChange={(e) =>
                      handleChangeIngredientsFields(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                  />
                </Box>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddField}
            >
              +
            </Button>
          </div>

          {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2" mt={1} mb={1}>
                  Name
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" mt={1} mb={1}>
                  Quantity
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  fullWidth
                />
              </Box>
            </Box> */}

          {/* {uploadedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Image ${index}`}
                style={{ marginRight: "10px", marginBottom: "10px" }}
              />
            ))} */}

          <div
            style={{
              overflowY: "scroll",
              height: "250px",
              border: "1px solid brown",
              marginTop: "10px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <DropzoneUploader
              onChangeStatus={handleChangeStatus}
              accept="image/*"
              inputContent={(files, extra) =>
                extra.reject
                  ? "Image files only"
                  : "Drag & Drop or Click to Browse Images"
              }
              styles={{
                dropzone: {
                  minHeight: 200,
                  maxHeight: 250,
                  marginTop: "10px",
                  marginBottom: "10px",
                },
                dropzoneActive: { borderColor: "green" },
              }}
            />
          </div>
          <Button
            sx={{
              marginTop: "10px",
            }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput type="file" />
          </Button>
        </Box>
      </Grid>
      <Grid item xs={0} sm={1}></Grid>
    </Grid>
  );
};

export default AddRecipeComponent;
