import ResponsiveAppBar from "@/components/header";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  OutlinedInput,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import dayjs from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DropzoneUploader from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller } from "react-hook-form";

import { GET_CATEGORIES } from "@/graphql/query/getCategories";
import { GET_TAGS } from "@/graphql/query/getTags";
import { CREATE_RECIPE, UPDATE_RECIPE } from "@/graphql/mutation/uploadRecipe";
import { UPLOAD_FILE } from "@/graphql/mutation/upload-file";
import { MULTI_UPLOADER } from "@/graphql/mutation/multiUploader";
import { CREATE_INGREDIENT } from "@/graphql/mutation/createIngredient";
import { GET_RECIPE_DETAILS } from "@/graphql/query/getRecipeDetails";
import { getImageUrl } from "@/utils/getImageUrl";

import client from "@/graphql/apollo-client";
import * as yup from "yup";

const today = dayjs();

const todayStartOfTheDay = today.startOf("day");

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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { getCookie } from "cookies-next";
import { uploadFileClient } from "@/graphql/apollo-client";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/router";

const AddRecipeComponent = (props: any) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [categoriesList, setcategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [formData, setFormData] = useState({});
  console.log("uploadedFiles", uploadedFiles);

  const [tags, setTags] = React.useState<string[]>([]);
  const router = useRouter();
  const recipe_id = getCookie("recipe-id");

  const [recipeDetailsData, setRecipeDetailsData] = useState();
  const [pageLoaded, setPageLoaded] = useState(false);

  const [categories, setCategories] = React.useState<string[]>([]);

  //mutations
  const [createIngredientMutation] = useMutation(CREATE_INGREDIENT);
  const [multiUploaderMutation] = useMutation(MULTI_UPLOADER);
  const [createRecipeMutation] = useMutation(CREATE_RECIPE);
  const [updateRecipeMutation] = useMutation(UPDATE_RECIPE);

  const userID = getCookie("id");

  const handleChangeCategories = (
    event: SelectChangeEvent<typeof categories>
  ) => {
    const {
      target: { value },
    } = event;
    setCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeTags = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;
    setTags(typeof value === "string" ? value.split(",") : value);
  };

  const [fields, setFields] = useState([{ i_name: "", i_count: "" }]);
  console.log("fieldsfields", fields);

  const schema = yup.object().shape({
    title: yup.string().label("Title").required("Title is required"),
    description: yup
      .string()
      .label("Description")
      .required("Description is required"),
    instructions: yup
      .string()
      .label("Instructions")
      .required("Instructions is required"),
    time: yup.string().required("Preparation Time is required"),
    cookingTime: yup.string().required("Cooking Time is required"),
    categories: yup.array().required("Please select at least one category"),
    tags: yup.array().required("Please select at least one tag"),

    ingredients: yup.array().of(
      yup.object().shape({
        i_name: yup.string().required("Name is required"),
        i_count: yup.string().required("Count is required"),
      })
    ),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    getValues,
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      ingredients: fields,
    },
  });

  const onSubmit = async (data: any, e: any) => {
    if (e.key === "Enter") {
      setFormData(formData);
    }
    const preparationTime = data?.time;
    const p_dateObject = new Date(preparationTime);
    const p_hours = p_dateObject.getHours().toString().padStart(2, "0");
    const p_minutes = p_dateObject.getMinutes().toString().padStart(2, "0");
    const p_timeString = `${p_hours}:${p_minutes}`;

    const cookingTime = data?.cookingTime;
    const c_dateObject = new Date(cookingTime);
    const c_hours = c_dateObject.getHours().toString().padStart(2, "0");
    const c_minutes = c_dateObject.getMinutes().toString().padStart(2, "0");
    const c_timeString = `${c_hours}:${c_minutes}`;

    try {
      const mutationPromises = data?.ingredients?.map(
        async (ingredient: any) => {
          return await createIngredientMutation({
            variables: {
              data: {
                title: ingredient?.i_name,
                count: ingredient?.i_count,
                publishedAt: new Date(),
              },
            },
          })
            .then((response) => response.data.createIngredient.data)
            .catch((error) => console.error(error));
        }
      );
      let IngredientsResponse;

      await Promise.all(mutationPromises)
        .then((results) => {
          IngredientsResponse = results;
        })
        .catch((error) => console.error(error));

      const IngredientsIdArray = IngredientsResponse?.map((item) => item?.id);
      let multiFileUpload;
      if (uploadedFiles && router.pathname == "/add-recipe") {
        multiFileUpload = await uploadFileClient.mutate({
          mutation: MULTI_UPLOADER,
          variables: {
            files: uploadedFiles,
            refId: userID,
            publishedAt: new Date(),
          },
        });
      }

      const imagesIdArray = multiFileUpload?.data?.multipleUpload?.map(
        (item) => item?.data?.id
      );

      let createResipeResponse;
      let updateRecipeResponse;
      if (router.pathname === "/add-recipe") {
        createResipeResponse = await createRecipeMutation({
          variables: {
            data: {
              Description: data?.description,
              Images: imagesIdArray || [],
              Title: data?.title,
              categories: data?.categories,
              cooking_time: c_timeString,
              ingredients: IngredientsIdArray,
              instructions: data?.instructions,
              prep_time: p_timeString,
              tags: data?.tags,
              user: userID,
              publishedAt: new Date(),
            },
          },
        });
      }
      if (router.pathname === "/edit-recipe") {
        updateRecipeResponse = await updateRecipeMutation({
          variables: {
            updateRecipeId: recipe_id,
            data: {
              Description: data?.description,
              Title: data?.title,
              cooking_time: c_timeString,
              Images: null,
              categories: data?.categories,
              ingredients: IngredientsIdArray,
              instructions: data?.instructions,
              prep_time: p_timeString,
              tags: data?.tags,
              user: userID,
            },
          },
        });
      }
      if (createResipeResponse) {
        notifySuccess("Recipe has ben created");
      } else notifyError("Something Went Wrong");
    } catch (error) {
      console.log("error", error);

      notifyError("Something Went Wrong");
    }
  };

  const handleChangeIngredientsFields = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
    setValue(`ingredients[${index}].${key}`, value);
  };

  const handleAddField = () => {
    setFields([...fields, { i_name: "", i_count: "" }]);
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    // if (uploadedFiles?.length === ) {
    if (status === "done" && file) {
      setUploadedFiles([...uploadedFiles, file]);
    } else if (status === "removed") {
      let newArr = uploadedFiles.filter((item) => item !== file);
      setUploadedFiles(newArr);
    }
    // }
  };

  const [onlineFiles, setOnlineFiles] = useState<File[]>([]);
  console.log("onlineFiles", onlineFiles);

  const getCategoriesList = async () => {
    const queries = [
      client.query({
        query: GET_CATEGORIES,
      }),
    ];
    const response = await Promise.all(queries);
    setcategoriesList(response[0]?.data?.categories?.data);
  };

  const getTagsList = async () => {
    const queries = [
      client.query({
        query: GET_TAGS,
      }),
    ];
    const response = await Promise.all(queries);
    setTagsList(response[0]?.data?.tags?.data);
  };

  const getRecipeDetails = async () => {
    const queries = [
      client.query({
        query: GET_RECIPE_DETAILS,
        variables: {
          recipeId: recipe_id,
        },
      }),
    ];
    const response = await Promise.all(queries);
    setRecipeDetailsData(response[0]?.data?.recipe?.data?.attributes);
    const categoriesIdArray =
      response[0]?.data?.recipe?.data?.attributes?.categories?.data?.map(
        (item: any) => item.id
      );
    const tagIdArray =
      response[0]?.data?.recipe?.data?.attributes?.tags?.data?.map(
        (item: any) => item.id
      );

    const fieldsArray =
      response[0]?.data?.recipe?.data?.attributes.ingredients.data.map(
        (item, index) => {
          setValue(`ingredients[${index}].i_name`, item.attributes.title);
          setValue(`ingredients[${index}].i_count`, item.attributes.count);

          return {
            i_name: item.attributes.title,
            i_count: item.attributes.count,
          };
        }
      );
    setFields(fieldsArray);

    setCategories(categoriesIdArray);
    setTags(tagIdArray);

    const onlineImageURLs =
      response[0]?.data?.recipe?.data?.attributes?.Images?.data?.map((item) =>
        getImageUrl(item?.attributes?.url)
      );

    const fetchPromises = onlineImageURLs.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], url, { type: blob.type });
    });

    const files = await Promise.all(fetchPromises);
    console.log("onlineImageURLs", { onlineImageURLs, files });

    setUploadedFiles(files);
  };

  useEffect(() => {
    getCategoriesList();
    getTagsList();
    if (router.pathname === "/edit-recipe") {
      getRecipeDetails();
    }
    setTimeout(() => {
      setPageLoaded(true);
    }, 1000);
  }, []);
  console.log(
    "recipeDetailsData",
    recipeDetailsData?.Images?.data?.map((item) =>
      getImageUrl(item?.attributes?.url)
    )
  );

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return dayjs().hour(hours).minute(minutes).second(0);
  };

  return (
    <>
      {pageLoaded ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container pt={2} pb={15}>
            <Grid item xs={0} sm={1}></Grid>
            <Grid item xs={12} sm={5}>
              <Box p={3}>
                <Typography variant="subtitle2" mb={1}>
                  Enter Title{" "}
                </Typography>
                <TextField
                  {...register("title")}
                  name="title"
                  id="title"
                  label="Title"
                  margin="normal"
                  fullWidth
                  defaultValue={
                    recipeDetailsData ? recipeDetailsData.Title : ""
                  }
                />
                {errors.title && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Title is required
                  </Typography>
                )}
                <Typography variant="subtitle2" mt={1} mb={1}>
                  Enter Description{" "}
                </Typography>
                <TextField
                  {...register("description")}
                  name="description"
                  id="description"
                  label="Description"
                  margin="normal"
                  fullWidth
                  defaultValue={
                    recipeDetailsData ? recipeDetailsData.Description : ""
                  }
                />
                {errors.description && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Description is required
                  </Typography>
                )}
                <Typography variant="subtitle2" mt={1} mb={1}>
                  Enter Cooking Instructions
                </Typography>
                <TextField
                  {...register("instructions")}
                  name="instructions"
                  id="instructions"
                  label="Instructions"
                  margin="normal"
                  fullWidth
                  defaultValue={
                    recipeDetailsData ? recipeDetailsData.instructions : ""
                  }
                />
                {errors.instructions && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Instructions is required
                  </Typography>
                )}
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
                      <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            ampm={false}
                            // defaultValue={todayStartOfTheDay}
                            defaultValue={
                              recipeDetailsData
                                ? parseTimeString(recipeDetailsData.prep_time)
                                : todayStartOfTheDay
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                    {errors.time && (
                      <Typography color={"red"} fontSize={"13px"}>
                        Preparation time is required
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" mt={1} mb={1}>
                      Cooking Time
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="cookingTime"
                        control={control}
                        render={({ field }) => (
                          <TimePicker
                            {...field}
                            ampm={false}
                            defaultValue={
                              recipeDetailsData
                                ? parseTimeString(
                                    recipeDetailsData.cooking_time
                                  )
                                : todayStartOfTheDay
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                    {errors.cookingTime && (
                      <Typography color={"red"} fontSize={"13px"}>
                        Cooking time is required
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="subtitle2" mt={1} mb={1}>
                  Select Categories
                </Typography>

                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-multiple-name-label"
                      multiple
                      value={categories}
                      onChange={(e) => {
                        handleChangeCategories(e);
                        field.onChange(e);
                      }}
                      onLoad={(e) => {}}
                      input={<OutlinedInput label="Categories" />}
                      MenuProps={MenuProps}
                      fullWidth
                    >
                      {categoriesList.map((item: any) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.attributes?.Title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.categories && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Categories are required
                  </Typography>
                )}
                <Typography variant="subtitle2" mt={1} mb={1}>
                  Select tags
                </Typography>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-multiple-name-label"
                      multiple
                      value={tags}
                      onChange={(e) => {
                        handleChangeTags(e);
                        field.onChange(e);
                      }}
                      input={<OutlinedInput label="Tags" />}
                      MenuProps={MenuProps}
                      fullWidth
                    >
                      {tagsList.map((item: any) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.attributes?.Title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.tags && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Tags are required
                  </Typography>
                )}
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
                        <Controller
                          name={`ingredients.${index}.i_name`}
                          control={control}
                          render={({ field, fieldState }) => {
                            return (
                              <div>
                                <TextField
                                  {...field}
                                  id={`ingredients.${index}.i_name`}
                                  label="Name"
                                  variant="outlined"
                                  fullWidth
                                  value={
                                    router.pathname === "/edit-recipe"
                                      ? field.value
                                      : field[index]?.i_name?.value
                                  }
                                  onChange={(e) =>
                                    handleChangeIngredientsFields(
                                      index,
                                      "i_name",
                                      e.target.value
                                    )
                                  }
                                />
                                {fieldState.error && (
                                  <Typography color="red" fontSize="13px">
                                    {fieldState?.error?.message}
                                  </Typography>
                                )}
                              </div>
                            );
                          }}
                        />
                      </Box>
                      <Box>
                        <Controller
                          name={`ingredients.${index}.i_count`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <div>
                              <TextField
                                {...field}
                                id={`ingredients.${index}.i_count`}
                                label="Quantity"
                                variant="outlined"
                                fullWidth
                                // value={field[index]?.i_count?.value}
                                value={
                                  router.pathname === "/edit-recipe"
                                    ? field.value
                                    : field[index]?.i_count?.value
                                }
                                onChange={(e) =>
                                  handleChangeIngredientsFields(
                                    index,
                                    "i_count",
                                    e.target.value
                                  )
                                }
                              />
                              {fieldState.error && (
                                <Typography color="red" fontSize="13px">
                                  {fieldState?.error?.message}
                                </Typography>
                              )}
                            </div>
                          )}
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
                    // initialFiles={
                    //   recipeDetailsData?.Images?.data?.map((item) => ({
                    //     dataUrl: getImageUrl(item?.attributes?.url),
                    //     file: { name: item?.attributes?.url, size: 1 },
                    //   })) || []
                    // }
                    onChangeStatus={handleChangeStatus}
                    // initialFiles={uploadedFiles}
                    maxFiles={5}
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
                  variant="contained"
                  type="submit"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Recipe
                  {/* <VisuallyHiddenInput type="file" /> */}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={0} sm={1}></Grid>
          </Grid>
        </form>
      ) : (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}
    </>
  );
};

export default AddRecipeComponent;
