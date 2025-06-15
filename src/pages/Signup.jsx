import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("/register", {
        email: data.email,
        password: data.password,
        name: data.name,
      });

      const res = await axios.post("/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Signup successful!", {
        position: "top-center",
        autoClose: 500,
        onClose: () => navigate("/"),
      });
    } catch {
      toast.error("Signup failed. Try a different email.", {
        position: "top-center",
        autoClose: 500,
      });
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#e3f2fd", color: "#5eb89b" }}
        >
          Signup
        </Button>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </Box>
  );
}
