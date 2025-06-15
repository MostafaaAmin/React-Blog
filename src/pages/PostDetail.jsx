import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  Box, Typography, Button, Paper, Avatar
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => toast.error("Failed to load post", { position: 'top-center' }));
  }, [id]);

  const user = JSON.parse(localStorage.getItem('user'));
  const canEdit = user && post && user.id === post.userId;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/posts/${id}`);
      toast.success("Post deleted", {
        position: "top-center",
        autoClose: 500,
        onClose: () => navigate('/')
      });
    } catch {
      toast.error("Failed to delete post", { position: 'top-center' });
    }
  };

  if (!post) return <Typography align="center">Loading...</Typography>;

  return (
    <Box maxWidth={800} mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fdfdfd' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {post.category} — {post.date}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
          <Typography variant="caption" color="text.secondary" fontStyle="italic">
            {post.author}
          </Typography>
        </Box>
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 2, mb: 3 }}
        />
        <Typography variant="body1" paragraph>
          {post.description}
        </Typography>

        {canEdit && (
          <Box mt={3} display="flex" gap={2}>
            <Button variant="outlined" onClick={() => navigate(`/edit/${post.id}`)}>Edit</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        )}
      </Paper>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
}
