import { commentType, PostType } from "@lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseAPI from "@lib/API/api";

interface PostsState {
  posts: PostType[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: PostsState = {
  posts: [],
  loading: "idle",
  error: null,
};

// Async thunks
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await baseAPI.get(
    "/post/"
  );
  return response.data;
});
export const addPost = createAsyncThunk(
  "posts/addPost",
  async (postData: { description: string}) => {
    const formData = new FormData();
    //formData.append("title", postData.title);
    formData.append("value", postData.description);
    // formData.append("image", postData.image);

    const response = await baseAPI.post(
      "/post/",
        {
            value: postData.description
        }
    );
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({
    postId,
    postData,
  }: {
    postId: string;
    postData: { title?: string; description?: string; image?: File };
  }) => {
    const formData = new FormData();
    if (postData.title) formData.append("title", postData.title);
    if (postData.description)
      formData.append("description", postData.description);
    if (postData.image) formData.append("image", postData.image);

    const response = await baseAPI.put(
      `/update-post/${postId}`,
      formData,
    );
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    await axios.delete(
      `https://mindconnect-vebk.onrender.com/api/post/delete-post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return postId;
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }: { postId: string; content: string }) => {
    const response = await axios.post(
      `https://mindconnect-vebk.onrender.com/api/post/${postId}/add-comment`,
      {
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: string) => {
    const response = await axios.get(
      `https://mindconnect-vebk.onrender.com/api/post/${postId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string) => {
    const response = await axios.patch(
      `https://mindconnect-vebk.onrender.com/api/post/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return { postId, message: response.data };
  }
);

export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async (postId: string) => {
    const response = await axios.patch(
      `https://mindconnect-vebk.onrender.com/api/post/${postId}/unlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return { postId, message: response.data };
  }
);

// New thunk for fetching a post by ID
export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (postId: string) => {
    const response = await axios.get(
      `https://mindconnect-vebk.onrender.com/api/post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    await axios.delete(
      `https://mindconnect-vebk.onrender.com/api/post/delete-comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return { postId, commentId };
  }
);

// Slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<PostType[]>) => {
          state.loading = "succeeded";
          state.posts = action.payload;
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(addPost.fulfilled, (state, action: PayloadAction<PostType>) => {
        state.posts.push(action.payload);
      })
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<PostType>) => {
          const index = state.posts.findIndex(
            (post) => post.id === action.payload.id
          );
          if (index !== -1) {
            state.posts[index] = action.payload;
          }
        }
      )
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post.id === action.payload.postId
        );
        if (post) {
          post.comments.push(action.payload);
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.posts.forEach((post) => {
          post.comments = action.payload.map((comment: commentType) => {
            if (comment.postId === post.id) {
              return comment;
            }
          });
        });

        const post = state.posts.find(
          (post) => post.id == action.payload.postId
        );
        console.log(post);
        if (post) {
          post.comments = action.payload;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post.id === action.payload.postId
        );
        if (post) {
          const userId = localStorage.getItem("userId");
          if (userId && !post.likes.includes(userId)) {
            post.likes.push(userId);
          }
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post.id === action.payload.postId
        );
        if (post) {
          const userId = localStorage.getItem("userId");
          if (userId) {
            post.likes = post.likes.filter((id) => id !== userId);
          }
        }
      })
      // Add case for fetchPostById
      .addCase(
        fetchPostById.fulfilled,
        (state, action: PayloadAction<PostType>) => {
          const existingPost = state.posts.find(
            (post) => post.id === action.payload.id
          );
          if (existingPost) {
            Object.assign(existingPost, action.payload);
          } else {
            state.posts.push(action.payload);
          }
        }
      )
      .addCase(
        deleteComment.fulfilled,
        (
          state,
          action: PayloadAction<{ postId: string; commentId: string }>
        ) => {
          const { postId, commentId } = action.payload;
          const post = state.posts.find((post) => post.id === postId);
          if (post) {
            post.comments = post.comments.filter(
              (comment) => comment !== commentId
            );
          }
        }
      );
  },
});

export default postsSlice.reducer;
