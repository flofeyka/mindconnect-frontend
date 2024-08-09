import { postAPI } from '@lib/API/postAPI'
import { commentType, PostType } from '@lib/types'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface PostsState {
	posts: PostType[]
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
	const data = await postAPI.fetchPosts();
	if(data.success) return data.items;
});

export const addPost = createAsyncThunk('posts/addPost', async (postData: { title: string; description: string; image: File }) => {
	const data = await postAPI.addPost(postData);
	if(data.success) return data.newPost;
});

export const updatePost = createAsyncThunk(
	'posts/updatePost',
	async ({
		postId,
		postData,
	}: {
		postId: string
		postData: { title?: string; description?: string; image?: File }
	}) => {

		const isPostUpdated = await postAPI.updatePost({ postId, postData });
		if (isPostUpdated) {
			return { postId, postData }
		}

	}
)

export const deletePost = createAsyncThunk(
	'posts/deletePost',
	async (postId: string) => {
		const isPostDeleted = await postAPI.deletePost(postId);
		return isPostDeleted ? postId : undefined;
	}
)

export const addComment = createAsyncThunk(
	'posts/addComment',
	async ({ postId, content }: { postId: string; content: string }) => {
		const data = await postAPI.addComment({ postId, content });
		if (data.isAdded) {
			return data.item;
		}
	}
)

export const fetchComments = createAsyncThunk(
	'posts/fetchComments',
	async (postId: string) => {
		const data = await postAPI.fetchComments(postId);
		if (data.success) {
			return data.items;
		}
	}
)

export const likePost = createAsyncThunk(
	'posts/likePost',
	async (postId: string) => {
		const data = await postAPI.likePost(postId);
		return data.success && postId;
	}
)

export const unlikePost = createAsyncThunk(
	'posts/unlikePost',
	async (postId: string) => {
		const data = await postAPI.unlikePost(postId);
		return data.success && postId;
	}
)

// New thunk for fetching a post by ID
export const fetchPostById = createAsyncThunk(
	'posts/fetchById',
	async (postId: string) => {
		const data = await postAPI.fetchPostById(postId);
		return data.success && data.item;
	}
)

export const deleteComment = createAsyncThunk(
	'posts/deleteComment',
	async ({ postId, commentId }: { postId: string; commentId: string }) => {
		const data = await postAPI.deleteComment(commentId);
		return data.success ? {
			postId, commentId
		} : undefined
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
			.addCase(
				fetchPosts.fulfilled,
				(state, action: PayloadAction<PostType[]>) => {
					state.loading = 'succeeded'
					state.posts = action.payload
				}
			)
			.addCase(fetchPosts.rejected, (state: PostsState, action) => {
				state.loading = 'failed'
				state.error = action.error.message || 'Failed to fetch posts'
			})
			.addCase(addPost.fulfilled, (state: PostsState, action: PayloadAction<PostType>) => {
				state.posts.push(action.payload)
			})
			.addCase(
				updatePost.fulfilled,
				(state: PostsState, action: PayloadAction<{ postId: string; postData: { title?: string; description?: string; image?: File } } | undefined>) => {
					if (action.payload) {
						const { postId, postData } = action.payload;
						const index = state.posts.findIndex(post => post._id === postId);
						if (index !== -1) {
							state.posts[index] = { ...state.posts[index], ...postData };
						}
					}
				}
			)
			.addCase(deletePost.fulfilled, (state, action: PayloadAction<string | undefined>) => {
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
				state.posts.forEach(post => {
					post.comments = action.payload.map((comment: commentType) => {
						if (comment.postId === post._id) {
							return comment
						}
					})
				})

				const post = state.posts.find(post => post._id == action.payload.postId)
				console.log(post)
				if (post) {
					post.comments = action.payload
				}
			})
			.addCase(likePost.fulfilled, (state, action: PayloadAction<string | false>) => {
				if (typeof action.payload === 'string') {
					const post = state.posts.find(
						post => post._id === action.payload
					)
					if (post) {
						const userId = localStorage.getItem('userId')
						if (userId && !post.likes.includes(userId)) {
							post.likes.push(userId)
						}
					}
				}
			})
			.addCase(unlikePost.fulfilled, (state, action: PayloadAction<string | false>) => {
				if (typeof action.payload === 'string') {
					const post = state.posts.find(
						post => post._id === action.payload
					)
					if (post) {
						const userId = localStorage.getItem('userId')
						if (userId) {
							post.likes = post.likes.filter(id => id !== userId)
						}
					}
				}
			})
			.addCase(
				fetchPostById.fulfilled,
				(state, action: PayloadAction<PostType>) => {
					const existingPost = state.posts.find(
						post => post._id === action.payload._id
					)
					if (existingPost) {
						Object.assign(existingPost, action.payload)
					} else {
						state.posts.push(action.payload)
					}
				}
			)
			.addCase(
				deleteComment.fulfilled,
				(
					state,
					action: PayloadAction<{ postId: string; commentId: string } | undefined>
				) => {
					if (action.payload) {
						const { postId, commentId } = action.payload
						const post = state.posts.find(post => post._id === postId)
						if (post) {
							post.comments = post.comments.filter(
								comment => comment !== commentId
							)
						}
					}
				}
			)
	},
})

export default postsSlice.reducer
