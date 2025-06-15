import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [image, setImage] = useState(initialData.image || "");
  const [description, setDescription] = useState(initialData.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image || !description) {
      toast.error("All fields are required");
      return;
    }
    onSubmit({ title, image, description });
    toast.success("Form submitted successfully");
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          multiline
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 2, backgroundColor: "#e3f2fd", color: "#5eb89b" }}
        >
          Submit
        </Button>
      </Box>
      <ToastContainer position="top-right" />
    </>
  );
};

export default PostForm;
