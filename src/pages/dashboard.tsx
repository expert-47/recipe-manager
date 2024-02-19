import React, { useEffect, useState } from "react";

import ResponsiveAppBar from "../components/header/index";
import RecipeCard from "@/components/recipe-card";
import { Grid } from "@mui/material";
import { GET_ALL_RECIPES } from "@/graphql/query/getAllRecipes";
import client from "@/graphql/apollo-client";

const arrayToIterateCards = [1, 2, 3, 4, 5, 6];

const Dashboard = () => {
  const [recipesState, setRecipesState] = useState([]);

  const getAllREcipes = async () => {
    const queries = [
      client.query({
        query: GET_ALL_RECIPES,
      }),
    ];
    const response = await Promise.all(queries);
    console.log("response", response);

    setRecipesState(response[0]?.data?.recipes?.data);
  };

  useEffect(() => {
    getAllREcipes();
  }, []);

  return (
    <div>
      <ResponsiveAppBar />
      <Grid container mt={5} spacing={2}>
        {recipesState?.map((item: number, index: number) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            md={4}
            justifyContent={"center"}
            display={"flex"}
          >
            <RecipeCard cardData={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
