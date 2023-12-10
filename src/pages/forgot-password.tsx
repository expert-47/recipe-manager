import React from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Link,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const ForgotPassword = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle forgot password logic here
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={2}
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <form
          style={{
            width: "100%", // Fix IE 11 issue.
            marginTop: "8px",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          {/* You can add more content here, such as a message or additional instructions */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{
              margin: "25px 0 8px",
            }}
            onClick={() => setOpen(true)}
          >
            Reset Password
          </Button>
        </form>
        <Grid container justifyContent="flex-end" mt={5}>
          <Grid item>
            <Link href="/">Already have an account? Sign in</Link>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword;
