import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Fab,
  IconButton,
  Chip,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowForwardIos as ArrowIcon,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch(() => {
        toast.error("Failed to load posts", { position: "top-center" });
        setPosts([]);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully", { position: "top-center" });
    } catch {
      toast.error("Failed to delete post", { position: "top-center" });
    }
  };

  if (posts === null)
    return (
      <Typography align="center" mt={5}>
        Loading...
      </Typography>
    );
  if (posts.length === 0)
    return (
      <Typography align="center" mt={5}>
        No posts available.
      </Typography>
    );

  return (
    <Box position="relative" px={3} py={4}>
      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        alignItems="stretch"
      >
        {posts.map((post) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={post.id}
            sx={{ display: "flex" }}
          >
            <Box position="relative" width="100%">
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  minHeight: 440,
                  maxHeight: 440,
                  backgroundColor: "#fdfdfd",
                  borderRadius: 3,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Link
                  to={`/post/${post.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardMedia
                    component="img"
                    image={post.imageUrl}
                    alt={post.title}
                    sx={{
                      height: 200,
                      width: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />
                </Link>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      mb: 1,
                      backgroundColor: "#e3f2fd",
                      color: "#5eb89b",
                      fontWeight: 600,
                    }}
                  />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/post/${post.id}`}
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      {post.title}
                    </Typography>
                    <ArrowIcon
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.description.length > 51 ? (
                      <>
                        {post.description.slice(0, 51)}...{" "}
                        <Link
                          to={`/post/${post.id}`}
                          style={{ color: "#5eb89b", fontWeight: 500 }}
                        >
                          Read More
                        </Link>
                      </>
                    ) : (
                      post.description
                    )}
                  </Typography>
                  <Box mt={2} display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontStyle="italic"
                    >
                      {post.author} — {post.date}
                    </Typography>
                  </Box>
                </CardContent>

                {isLoggedIn && user?.id === post.userId && (
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    gap={1}
                    p={1}
                    mt={-1}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/edit/${post.id}`)}
                        sx={{
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(post.id)}
                        sx={{
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            backgroundColor: "#ffebee",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      {isLoggedIn && (
        <Fab
          aria-label="add"
          onClick={() => navigate("/create")}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 999,
            boxShadow: 4,
            backgroundColor: "#5eb89b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#4da88c",
            },
          }}
        >
          <AddIcon />
        </Fab>
      )}
      <ToastContainer />
    </Box>
  );
}
