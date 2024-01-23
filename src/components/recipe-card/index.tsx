import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Menu,
  MenuItem,
  Box,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import Link from "next/link";
import ConfirmationDialogue from "../confirmation-modal/index";
import { getImageUrl } from "@/utils/getImageUrl";
import { client } from "@/api/graphql/client";
import {
  CREATE_FAVOURITE,
  DELETE_FAVOURITE,
} from "../../graphql/mutation/favorites";
import { ADD_COMMENT } from "@/graphql/mutation/addComment";
import { DELETE_RECIPE } from "@/graphql/mutation/deleteRecipe";
import { getCookie, setCookie } from "cookies-next";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useMutation } from "@apollo/client";
const cardOptions = ["Edit", "Details"];

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeCard(props: any) {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [favouriteIconColor, setfavouriteIconColor] = useState(false);
  const [favId, setFavId] = useState(-1);
  const [value, setValue] = React.useState<number | null>(2);
  const [commentDialogueOpen, setCommentDialogueOpen] = useState(false);
  const [recipeComment, setRecipeComment] = useState("");
  const userID = getCookie("id");
  const [addCommentMutation] = useMutation(ADD_COMMENT);
  const [deleteRecipeMutation] = useMutation(DELETE_RECIPE);

  const {
    cardData,
    profileScreenFaviourites = false,
    editAndDeleteAccess = false,
  } = props;

  // get show favorites
  useEffect(() => {
    let favoritesExist = cardData?.attributes?.favourites?.data?.find(
      (item) => {
        if (
          item?.attributes?.recipe?.data?.id == cardData?.id &&
          item?.attributes?.user?.data?.id == userID
        )
          return item;
        else return null;
      }
    );
    console.log({ favoritesExist });

    if (favoritesExist?.id) {
      setfavouriteIconColor(true);
      setFavId(favoritesExist?.id);
    }
  }, [cardData]);

  const handleOpenUserMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    // Handle edit click
    handleCloseMenu();
  };

  const handleDetailsClick = () => {
    setExpanded(!expanded);
    handleCloseMenu();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createAndRemoveFavourit = async () => {
    try {
      if (favouriteIconColor) {
        // remove from favorites
        const response = await client.mutate({
          mutation: DELETE_FAVOURITE,
          variables: {
            deleteFavouriteId: favId,
          },
        });

        if (response?.data?.deleteFavourite?.data?.id) {
          setfavouriteIconColor(false);
          setFavId(-1);
        } else {
          // something went wrong
        }
      } else {
        // add to fav...
        const response = await client.mutate({
          mutation: CREATE_FAVOURITE,
          variables: {
            data: {
              publishedAt: new Date(),
              recipe: cardData?.id,
              user: userID,
            },
          },
        });
        // console.log("response?.data", response?.data);
        if (response?.data?.createFavourite?.data?.id) {
          setfavouriteIconColor(true);
          setFavId(response?.data?.createFavourite?.data?.id);
        } else {
          // something went wrong
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const setRecipeIdInCookie = (id: number) => {
    setCookie("recipe-id", id);
  };

  console.log("rrr", "2 = cardData", cardData);
  const handleCloseDialogue = () => {
    setCommentDialogueOpen(false);
  };
  const commentOnRecipe = async () => {
    if (!recipeComment) {
      return;
    }
    try {
      await addCommentMutation({
        variables: {
          data: {
            message: recipeComment,
            recipe: cardData.id,
            user: userID,
            publishedAt: new Date(),
          },
        },
      });

      notifySuccess("You have successfully added comment ");
    } catch (error) {
      notifyError("Something Went wrong ");
    }
  };

  const deleteRecipe = async () => {
    try {
      await deleteRecipeMutation({
        variables: {
          deleteRecipeId: cardData.id,
        },
      });

      notifySuccess("Recipe is deleted successfully ");
    } catch (error) {
      notifyError("Something Went wrong ");
    }
  };

  return (
    <Box>
      <Box>
        {cardData && (
          <Card sx={{ maxWidth: 345, minWidth: 310 }}>
            <CardHeader
              // avatar={
              //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              //     R
              //   </Avatar>
              // }
              action={
                <div>
                  <IconButton
                    aria-label="settings"
                    onClick={handleOpenUserMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    {editAndDeleteAccess && (
                      <MenuItem
                        onClick={() => setRecipeIdInCookie(cardData?.id)}
                      >
                        <Link
                          href={"/edit-recipe"}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          Edit
                        </Link>
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => setRecipeIdInCookie(cardData?.id)}>
                      <Link
                        href={"/recipe-details"}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        Details
                      </Link>
                    </MenuItem>
                    {editAndDeleteAccess && (
                      <MenuItem onClick={deleteRecipe}>Delete</MenuItem>
                    )}
                    <MenuItem onClick={() => setCommentDialogueOpen(true)}>
                      Add Comment
                    </MenuItem>
                  </Menu>
                </div>
              }
              title={cardData?.attributes?.Title}

              // subheader="September 14, 2016"
              // https://mui.com/static/images/cards/paella.jpg
            />
            <CardMedia
              component="img"
              height="194"
              image={
                cardData?.attributes?.Images?.data[0]?.attributes.url
                  ? getImageUrl(
                      cardData?.attributes?.Images?.data[0]?.attributes.url
                    )
                  : "https://mui.com/static/images/cards/paella.jpg"
              }
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {cardData?.attributes?.Description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              {!profileScreenFaviourites && (
                <IconButton
                  aria-label="add to favorites"
                  style={{
                    color: favouriteIconColor ? "red" : "",
                  }}
                  onClick={createAndRemoveFavourit}
                >
                  <FavoriteIcon />
                </IconButton>
              )}
              <Rating
                name="simple-controlled"
                value={
                  cardData?.attributes?.ratting?.data?.attributes?.count
                    ? cardData?.attributes?.ratting?.data?.attributes?.count
                    : 0
                }
                // onChange={(event, newValue) => {
                //   setValue(newValue);
                // }}
              />
              {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
              {/* <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
            </CardActions>
          </Card>
        )}

        <ConfirmationDialogue open={open} setOpen={setOpen} />
      </Box>
      <React.Fragment>
        <Dialog
          open={commentDialogueOpen}
          onClose={handleCloseDialogue}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              handleCloseDialogue();
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
                setRecipeComment(e?.target?.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogue}>Cancel</Button>
            <Button type="submit" onClick={commentOnRecipe}>
              Add Comment
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
}
