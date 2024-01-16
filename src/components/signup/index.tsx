import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import { SIGNUP } from "@/graphql/mutation/signup";
import { UPDATE_USER_PERMISSION } from "@/graphql/mutation/updateUsersPermissionsUser";
import { useMutation } from "@apollo/client";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/router";
import client from "@/graphql/apollo-client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/store/slice/auth-slice";
import { setCookie } from "cookies-next";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const [signupMutation, { loading, error }] = useMutation(SIGNUP);
  const [updateUserPermission] = useMutation(UPDATE_USER_PERMISSION);

  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().label("Name").required("Name is required"),
    email: yup
      .string()
      .label("Email")
      .required("Email is required")
      .email("Invalid email address")
      .matches(/^\S+@\S+\.\S{2,}$/i, "Invalid Email Format"),
    password: yup.string().label("Password").required("Password is required"),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (data: any, e: any) => {
    if (e.key === "Enter") {
      setFormData(formData);
    }
    try {
      const response = await signupMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            username: data.email,
          },
        },
      });
      const confirmedUser = response?.data?.register?.user?.confirmed;
      if (confirmedUser === true) {
        const { email, username, id } = response?.data?.register?.user;

        //  const userData = await client.query({
        //    query: SIGNUP,
        //    variables: {
        //      usersPermissionsUserId: id,
        //    },
        //  });
        const userData = {
          email,
          username,
          id,
        };

        setCookie("username", email);
        setCookie("email", email);
        setCookie("id", id);
        setCookie("name", data?.name);

        const updateUserResponse = await updateUserPermission({
          variables: {
            updateUsersPermissionsUserId: id,
            data: {
              Name: data?.name,
            },
          },
        });
        console.log("updateUserResponse", updateUserResponse);

        dispatch(
          userLoggedIn({
            user: userData,
            isAuthenticated: true,
          })
        );
        notifySuccess("Successfully Signup");
        router.push("/dashboard");
      } else {
        notifyError("Something went Wrong");
      }
    } catch (error) {
      if (error) {
        notifyError("Email or Username are already taken ");
        // setRegistrationSuccess(true);
      } else notifyError("Something went Wrong");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  {...register("name")}
                  name="name"
                  id="name"
                  fullWidth
                  autoFocus
                  label="Name"
                  margin="normal"
                />
                {errors.name && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Name is required
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register("email")}
                  name="email"
                  id="email"
                  type="email"
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Email is required
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password")}
                  name="password"
                  id="password"
                  type="password"
                  margin="normal"
                  fullWidth
                  label="Password"
                  autoComplete="current-password"
                  // onChange={handleChange}
                  onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const trimmedValue = e.currentTarget.value
                      ?.trimStart()
                      ?.trimEnd()
                      ?.replace(/ +(?= )/g, "");

                    if (trimmedValue !== undefined) {
                      setValue("password", trimmedValue);
                    }
                  }}
                />
                {errors.password && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Password is required
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onKeyDown={(e) => onSubmit(getValues, e)}
              disabled={Object.keys(errors).length > 0 ? true : false}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
      {/* <Copyright sx={{ mt: 5 }} /> */}
    </Container>
  );
};

export default Signup;
