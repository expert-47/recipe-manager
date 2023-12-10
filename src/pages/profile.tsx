import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CardContent,
  Card,
} from "@mui/material";
import ResponsiveAppBar from "@/components/header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import RecipeCard from "@/components/recipe-card";
// Dummy user data for demonstration
const dummyUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

const Profile = () => {
  const [value, setValue] = useState("favourites");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const arrayToIterateCards = [1, 2, 3];

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
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{
            width: 56,
            height: 56,
          }}
        />
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
      )}
      {value === "My Recipes" && (
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
                <Typography variant="body1" paragraph>
                  <strong>First Name:</strong> {dummyUser.firstName}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Last Name:</strong> {dummyUser.lastName}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Email:</strong> {dummyUser.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
