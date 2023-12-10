import React from "react";
import ResponsiveAppBar from "@/components/header";
import AddRecipeComponent from "@/components/add-recipe";

const EditRecipe = () => {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #ebf7ff, #edf4ff)",
        height: "100vh",
      }}
    >
      <ResponsiveAppBar />
      <AddRecipeComponent />
    </div>
  );
};

export default EditRecipe;
