"use client";
//packgae imports
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  Checkbox,
  TextField,
  Typography,
  CssBaseline,
  FormControlLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import recipeImage from "../../../public/images/recipe-pic.jpg";
import RMImage from "../recipe-manager-image/RMImage";
import { useForm } from "react-hook-form";

import { LOGIN_USER } from "@/graphql/mutation/auth";
import { useMutation } from "@apollo/client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/router";
import { USER_DATA } from "@/graphql/query/userData";
import client from "@/graphql/apollo-client";

import { userLoggedIn } from "@/store/slice/auth-slice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [loginMutation, { loading, error }] = useMutation(LOGIN_USER);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
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

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (data: any, e: any) => {
    if (e.key === "Enter") {
      setFormData(formData);
    }
    try {
      const response = await loginMutation({
        variables: {
          input: {
            identifier: data.email,
            password: data.password,
          },
        },
      });
      const confirmedUser = response?.data?.login?.user?.confirmed;
      if (confirmedUser === true) {
        const { email, username, id } = response?.data?.login?.user;
        // let userData = {
        //   email,
        //   username,
        //   id,
        // };

        const userData = await client.query({
          query: USER_DATA,
          variables: {
            usersPermissionsUserId: id,
          },
        });

        console.log("userData", id, userData);

        setCookie(
          "username",
          userData?.data.usersPermissionsUser?.data?.attributes?.email
        );
        setCookie(
          "name",
          userData?.data.usersPermissionsUser?.data?.attributes?.Name
        );
        setCookie(
          "email",
          userData?.data.usersPermissionsUser?.data?.attributes?.email
        );
        setCookie("id", userData?.data.usersPermissionsUser?.data?.id);
        setCookie(
          "profile_picture",
          userData?.data.usersPermissionsUser?.data?.attributes?.image?.data
            ?.attributes?.url
        );

        dispatch(
          userLoggedIn({
            user: userData?.data.usersPermissionsUser?.data,
            isAuthenticated: true,
          })
        );
        notifySuccess("Successfully LoggedIn!");
        router.push("/dashboard");
      } else {
        notifyError("Please confirm your email first");
      }
    } catch (error) {
      if (error) {
        notifyError("Email or Password is wrong ");
        // setRegistrationSuccess(true);
      } else notifyError("Login Error");
    }
  };

  return (
    <Box>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={6} md={7}>
          <RMImage src={recipeImage}></RMImage>
        </Grid>
        <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mt: 1 }}>
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
                  // onChange={handleChange}
                />
                {errors.email && (
                  <Typography color={"red"} fontSize={"13px"}>
                    Email is required
                  </Typography>
                )}
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onKeyDown={(e) => onSubmit(getValues, e)}
                  disabled={Object.keys(errors).length > 0 ? true : false}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
