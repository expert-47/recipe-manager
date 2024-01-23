import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CardContent,
  Card,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ResponsiveAppBar from "@/components/header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import RecipeCard from "@/components/recipe-card";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { getCookie, setCookie } from "cookies-next";
import { UPLOAD_FILE } from "@/graphql/mutation/upload-file";
import { useMutation } from "@apollo/client";
import { uploadFileClient } from "@/graphql/apollo-client";
import { UPDATE_USER_PERMISSION } from "@/graphql/mutation/updateUsersPermissionsUser";
import { getImageUrl } from "@/utils/getImageUrl";
import { notifyError, notifySuccess } from "@/utils/toast";
import { GET_FAVIOURITES_RECIPES } from "@/graphql/query/getFaviouritesRecipe";
import client from "@/graphql/apollo-client";
import { GET_ALL_RECIPES } from "@/graphql/query/getAllRecipes";

const Profile = () => {
  const user = useSelector((state) => state.authReducer.user);
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [userPermissionMutation, { loading, error }] = useMutation(
    UPDATE_USER_PERMISSION
  );

  const [value, setValue] = useState("favourites");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFileUrl, setuploadFileUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [nameOfUser, setNameOfUser] = useState("");
  const [faviouritesRecipes, setFaviouritesRecipes] = useState([]);
  const [userRecipesState, setuserRecipesState] = useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const name = getCookie("name");
  const email = getCookie("email");
  const userID = getCookie("id");
  const profile_picture = getCookie("profile_picture");

  useEffect(() => {
    getFaviouritesRecipe();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  // get faviourites recipe

  const getFaviouritesRecipe = async () => {
    const queries = [
      client.query({
        query: GET_FAVIOURITES_RECIPES,
        variables: {
          filters: {
            user: {
              id: {
                eq: userID,
              },
            },
          },
        },
      }),
      client.query({
        query: GET_ALL_RECIPES,
        variables: {
          filters: {
            user: {
              id: {
                eq: userID,
              },
            },
          },
        },
      }),
    ];
    const response = await Promise.all(queries);
    console.log("rrrr", response[0]?.data?.favourites?.data);
    setFaviouritesRecipes(response[0]?.data?.favourites?.data);
    setuserRecipesState(response[1]?.data?.recipes?.data);
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await uploadFileClient.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          file: selectedFile,
          refId: userID,
        },
      });

      await userPermissionMutation({
        variables: {
          data: {
            image: response?.data?.upload?.data?.id,
          },
          updateUsersPermissionsUserId: userID,
        },
      });
      notifySuccess("Profile Image updated successfully");

      setuploadFileUrl(response?.data?.upload?.data?.attributes?.url);
      setCookie(
        "profile_picture",
        response?.data?.upload?.data?.attributes?.url
      );
      setSelectedFile(null);
    } catch (error) {
      notifyError("Something Went wrong ");
      setSelectedFile(null);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateName = async () => {
    if (!nameOfUser) {
      return;
    }
    try {
      await userPermissionMutation({
        variables: {
          updateUsersPermissionsUserId: userID,
          data: {
            Name: nameOfUser,
          },
        },
      });
      setCookie("name", nameOfUser);

      notifySuccess("Name updated successfully");
    } catch (error) {
      notifyError("Something Went wrong ");
    }
  };

  console.log("faviouritesRecipes", faviouritesRecipes);

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        mt={2}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "normal",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src={
              getImageUrl(profile_picture)
                ? getImageUrl(profile_picture)
                : "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
            }
            sx={{
              width: 100,
              height: 100,
            }}
          />
          <input
            style={{
              width: "178px",
              cursor: "pointer",
              marginTop: 10,
              marginBottom: 10,
            }}
            name="profile_image"
            type="file"
            className="mt-10"
            accept=".png, .jpg, jpeg"
            onChange={handleFileChange} // {...register("profile_image")}
          />
          <Button
            onClick={uploadProfilePicture}
            variant="contained"
            disabled={selectedFile ? false : true}
          >
            upload
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tab value="favourites" label="favourites" />
          <Tab value="My Recipes" label="My Recipes" />
          <Tab value="Account" label="Account" />
        </Tabs>
      </Box>
      {value === "favourites" && (
        <Grid container mt={2} spacing={2}>
          {faviouritesRecipes?.map((item: any) => (
            <Grid
              key={`recipe-cards ${item}`}
              item
              xs={12}
              sm={6}
              md={4}
              justifyContent={"center"}
              display={"flex"}
            >
              <RecipeCard
                cardData={item?.attributes?.recipe?.data}
                profileScreenFaviourites={true}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {value === "My Recipes" && (
        <Grid container mt={5} spacing={2}>
          {userRecipesState?.map((item: any, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={4}
              justifyContent={"center"}
              display={"flex"}
            >
              <RecipeCard cardData={item} editAndDeleteAccess={true} />
            </Grid>
          ))}
        </Grid>
      )}
      {value === "Account" && (
        <Grid container justifyContent="center" alignItems="center" p={5}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Typography variant="body1" paragraph>
                  <strong>First Name:</strong> {dummyUser.firstName}
                </Typography> */}

                <Typography variant="body1" paragraph>
                  <strong>Name:</strong> {name}
                  {/* {username || user?.attributes
                    ? user?.attributes?.Name
                    : user?.username} */}
                  <EditIcon
                    style={{
                      color: "brown",
                      marginLeft: 15,
                      cursor: "pointer",
                    }}
                    onClick={handleClickOpen}
                  ></EditIcon>
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Email:</strong> {email}
                  {/* {email || user?.attributes
                    ? user?.attributes?.email
                    : user?.email} */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle>Update Name</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Click Update to change your name and cancel to close the dialogue
              box
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setNameOfUser(e?.target?.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={updateName}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
};

export default Profile;
