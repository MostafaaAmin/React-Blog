import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  Box, Button, TextField, Typography, Paper
} from '@mui/material';
import { toast } from 'react-toastify';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(res => {
        reset(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id, reset]);

  const onSubmit = async (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return toast.error('Unauthorized');

    try {
      await axios.put(`/posts/${id}`, {
        ...data,
        userId: user.id,
        author: user.name,
        date: new Date().toLocaleDateString()
      });
      toast.success('Post updated successfully');
      navigate(`/post/${id}`);
    } catch {
      toast.error('Error updating post');
    }
  };

  if (loading) return <Typography align="center">Loading...</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fdfdfd' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>Edit Post</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            {...register('imageUrl', {
              required: 'Image URL is required',
              validate: value => value.startsWith('http') || 'Must be a valid URL'
            })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />
          <TextField
            label="Category"
            fullWidth
            margin="normal"
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, backgroundColor: "#e3f2fd", color: "#5eb89b" }}>
            Update Post
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
