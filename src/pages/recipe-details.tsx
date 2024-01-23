import ResponsiveAppBar from "@/components/header";
import React, { useEffect, useState } from "react";
import ImageSlider from "../components/image-slider/index";
import { Grid, Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { GET_RECIPE_DETAILS } from "@/graphql/query/getRecipeDetails";
import { getCookie } from "cookies-next";
import client from "@/graphql/apollo-client";

// Dummy data for demonstration
const data = {
  title: "Delicious Pasta",
  categories: ["Italian", "Pasta"],
  description: "A mouthwatering pasta dish with a rich tomato sauce.",
  preparationTime: "20 minutes",
  cookingTime: "30 minutes",
  ingredients: [
    { name: "Pasta", quantity: "250g" },
    { name: "Tomatoes", quantity: "4" },
    { name: "Olive Oil", quantity: "2 tbsp" },
  ],
  cookingInstructions:
    "Boil pasta. Prepare sauce with tomatoes and olive oil. Mix with pasta.",
  tags: ["Easy", "Quick", "Vegetarian"],
};

const RecipeDetails = () => {
  const [recipeData, setrecipeData] = useState();
  const recipe_id = getCookie("recipe-id");
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
    console.log("response", response[0]?.data?.recipe?.data?.attributes);
    setrecipeData(response[0]?.data?.recipe?.data?.attributes);
  };
  useEffect(() => {
    getRecipeDetails();
  }, []);

  const categoriesTitlesArray = recipeData?.categories?.data?.map((item) => {
    return item?.attributes?.Title;
  });
  console.log("recipeData", recipeData);

  return (
    <div>
      <ResponsiveAppBar />
      {recipeData?.Images?.data?.length > 0 ? (
        <ImageSlider imagesUrl={recipeData?.Images?.data} />
      ) : (
        <Box
          mt={10}
          mb={10}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom mb={0}>
            {"This Recipe do not have images "}
          </Typography>
        </Box>
      )}
      <Grid container spacing={3} p={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ paddingBottom: "16px", textAlign: "center" }}>
              <Typography variant="h4" gutterBottom mb={0}>
                <strong>Title:</strong> {recipeData?.Title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography color="body1" gutterBottom mb={0}>
                <strong>Categories:</strong> {categoriesTitlesArray?.join(", ")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Description:</strong> {recipeData?.Description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Preparation Time:</strong> {recipeData?.prep_time}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Cooking Time:</strong> {recipeData?.cooking_time}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Ingredients:</strong>
                <ul>
                  {recipeData?.ingredients?.data.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient?.attributes?.title}{" "}
                      <strong style={{ marginLeft: "40px" }}>
                        {ingredient?.attributes?.count}
                      </strong>
                    </li>
                  ))}
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Cooking Instructions:</strong>{" "}
                {recipeData?.instructions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Tags:</strong>{" "}
                {recipeData?.tags?.data.map((item, index) => (
                  <Chip
                    key={index}
                    label={item?.attributes?.Title}
                    style={{ marginRight: "4px" }}
                  />
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {recipeData?.comments?.data?.length > 0 && (
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent style={{ paddingBottom: "16px" }}>
                <strong>Comments:</strong>{" "}
                {recipeData?.comments?.data?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                      mt={1}
                    >
                      <Typography variant="subtitle1">
                        {item?.attributes?.user?.data?.attributes?.Name}:
                      </Typography>
                      <Typography variant="subtitle2">
                        {item?.attributes?.message}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default RecipeDetails;
