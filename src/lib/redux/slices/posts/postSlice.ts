import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Types
interface Post {
	_id: string
	owner: string
	title: string
	description?: string
	image?: string
	likes: string[]
	comments: string[]
	createdAt: string
}

interface PostsState {
	posts: Post[]
	loading: 'idle' | 'pending' | 'succeeded' | 'failed'
	error: string | null
}

// Initial state
const initialState: PostsState = {
	posts: [],
	loading: 'idle',
	error: null,
}

// Async thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const response = await axios.get(
		'https://mindconnect-vebk.onrender.com/api/post/last-posts',
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}
	)
	return response.data
})

export const addPost = createAsyncThunk(
	'posts/addPost',
	async (postData: Partial<Post>) => {
		const response = await axios.post(
			'https://mindconnect-vebk.onrender.com/api/post/add-post',
			postData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		return response.data
	}
)

export const updatePost = createAsyncThunk(
	'posts/updatePost',
	async ({ postId, postData }: { postId: string; postData: Partial<Post> }) => {
		const response = await axios.patch(
			`https://mindconnect-vebk.onrender.com/api/post/update-post/${postId}`,
			postData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		return response.data
	}
)

export const deletePost = createAsyncThunk(
	'posts/deletePost',
	async (postId: string) => {
		await axios.delete(
			`https://mindconnect-vebk.onrender.com/api/post/delete-post/${postId}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		return postId
	}
)

export const addComment = createAsyncThunk(
	'posts/addComment',
	async ({ postId, content }: { postId: string; content: string }) => {
		const response = await axios.post(
			`https://mindconnect-vebk.onrender.com/api/post/${postId}/add-comment`,
			{
				content,
			},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		return response.data
	}
)

export const fetchComments = createAsyncThunk(
	'posts/fetchComments',
	async (postId: string) => {
		const response = await axios.get(
			`https://mindconnect-vebk.onrender.com/api/post/${postId}/comments`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		return response.data
	}
)

// Slice
const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPosts.pending, state => {
				state.loading = 'pending'
			})
			.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
				state.loading = 'succeeded'
				state.posts = action.payload
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.loading = 'failed'
				state.error = action.error.message || 'Failed to fetch posts'
			})
			.addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
				state.posts.push(action.payload)
			})
			.addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
				const index = state.posts.findIndex(
					post => post._id === action.payload._id
				)
				if (index !== -1) {
					state.posts[index] = action.payload
				}
			})
			.addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
				state.posts = state.posts.filter(post => post._id !== action.payload)
			})
			.addCase(addComment.fulfilled, (state, action) => {
				const post = state.posts.find(
					post => post._id === action.payload.postId
				)
				if (post) {
					post.comments.push(action.payload)
				}
			})
			.addCase(fetchComments.fulfilled, (state, action) => {
				const post = state.posts.find(
					post => post._id === action.payload.postId
				)
				if (post) {
					post.comments = action.payload.comments
				}
			})
	},
})

export default postsSlice.reducer
