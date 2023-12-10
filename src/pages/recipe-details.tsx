import ResponsiveAppBar from "@/components/header";
import React from "react";
import ImageSlider from "../components/image-slider/index";
import { Grid, Card, CardContent, Typography, Chip } from "@mui/material";

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
  return (
    <div>
      <ResponsiveAppBar />
      <ImageSlider />
      <Grid container spacing={3} p={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ paddingBottom: "16px", textAlign: "center" }}>
              <Typography variant="h4" gutterBottom mb={0}>
                {data.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography color="body1" gutterBottom mb={0}>
                <strong>Categories:</strong> {data.categories.join(", ")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Description:</strong> {data.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Preparation Time:</strong> {data.preparationTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Cooking Time:</strong> {data.cookingTime}
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
                  {data.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name} - {ingredient.quantity}
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
                {data.cookingInstructions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ paddingBottom: "16px" }}>
              <Typography variant="body1" paragraph mb={0}>
                <strong>Tags:</strong>{" "}
                {data.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    style={{ marginRight: "4px" }}
                  />
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RecipeDetails;
