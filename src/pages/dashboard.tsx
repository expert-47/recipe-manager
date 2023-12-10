import React from "react";

import ResponsiveAppBar from "../components/header/index";
import RecipeCard from "@/components/recipe-card";
import { Grid } from "@mui/material";
const arrayToIterateCards = [1, 2, 3, 4, 5, 6];
const Dashboard = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <Grid container mt={5} spacing={2}>
        {arrayToIterateCards?.map((item: number) => (
          <Grid
            key={`recipe-cards ${item}`}
            item
            xs={12}
            sm={6}
            md={4}
            justifyContent={"center"}
            display={"flex"}
          >
            <RecipeCard />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
