import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Interface for a single post
interface Post {
	_id: string
	owner: string
	title: string
	description: string
	image: string
	likes: string[]
	comments: any[] // You might want to define a more specific type for comments
	createdAt: string
	__v: number
}

// Interface for the posts state
interface PostsState {
	currentPost: Post | null
	loading: 'idle' | 'pending' | 'succeeded' | 'failed'
	error: string | null
}

// Helper function to get token
const getToken = () => localStorage.getItem('token')

// Async thunk for fetching a single post by ID
export const fetchPostById = createAsyncThunk(
	'posts/fetchById',
	async (postId: string) => {
		const response = await axios.get(
			`https://mindconnect-vebk.onrender.com/api/post/${postId}`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}
		)
		return response.data
	}
)

// Initial state
const initialState: PostsState = {
	currentPost: null,
	loading: 'idle',
	error: null,
}

// Create the posts slice
const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPostById.pending, state => {
				state.loading = 'pending'
			})
			.addCase(
				fetchPostById.fulfilled,
				(state, action: PayloadAction<Post>) => {
					state.loading = 'succeeded'
					state.currentPost = action.payload
					state.error = null
				}
			)
			.addCase(fetchPostById.rejected, (state, action) => {
				state.loading = 'failed'
				state.error = action.error.message || 'Failed to fetch post'
			})
	},
})

export default postsSlice.reducer
