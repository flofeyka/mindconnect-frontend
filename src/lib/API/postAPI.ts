import baseAPI from "./api"

export const postAPI = {
    async getPostById(postId: string) {
        const { status, data } = await baseAPI.get(`post/${postId}`)
        return {
            item: data,
            status
        }
    },

    async fetchPosts() {
        const { status, data } = await baseAPI.get(
            'api/post/last-posts'
        )
        return {
            success: status === 200,
            items: data
        }
    },

    async addPost(postData: { title: string; description: string; image: File }) {
        const formData = new FormData()
        formData.append('title', postData.title)
        formData.append('description', postData.description)
        formData.append('image', postData.image)

        const { data, status } = await baseAPI.post('post/add-post', formData)
        return {
            newPost: data.newPost, success: status === 200
        }
    },

    async updatePost({
        postId,
        postData,
    }: {
        postId: string
        postData: { title?: string; description?: string; image?: File }
    }) {
        const formData = new FormData()
        if (postData.title) formData.append('title', postData.title)
        if (postData.description)
            formData.append('description', postData.description)
        if (postData.image) formData.append('image', postData.image)

        const { status } = await baseAPI.patch(`post/update-post/${postId}`, formData)
        return status === 200;
    },

    async deletePost(postId: string) {
        const { status } = await baseAPI.delete(`post/delete-post/${postId}`)
        return status === 200;
    },

    async addComment({ postId, content }: { postId: string; content: string }) {
        const { status, data } = await baseAPI.post(`post/${postId}/add-comment`)
        return {
            isAdded: status === 200,
            item: data.comment
        }
    },

    async fetchComments(postId: string) {
        const { data, status } = await baseAPI.get(`post/${postId}/comments`)

        return {
            items: data,
            success: status === 200
        }
    },

    async likePost(postId: string) {
        const { status } = await baseAPI.patch(`post/${postId}/like`)
        return {
            success: status === 200
        }
    },

    async unlikePost(postId: string) {
        const { status } = await baseAPI.patch(`post/${postId}/unlike`)
        return {
            success: status === 200
        }
    },

    async fetchPostById(postId: string) {
        const { data, status } = await baseAPI.get(`post/${postId}`)
        return {
            item: data,
            success: status === 200
        }
    },

    async deleteComment(commentId: string) {
        const { status } = await baseAPI.delete(`post/delete-comment/${commentId}`)
        return {
            success: status === 200
        }
    }



}