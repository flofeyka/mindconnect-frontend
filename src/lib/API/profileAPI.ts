import baseAPI from "@lib/API/api";

export const UserAPI = {
    async getFollowers(id: number) {
        const {data} = await baseAPI.get(`/user/${id}/followers`);

        return data;
    },
    async getSubscriptions(id: number) {
        const {data} = await baseAPI.get(`/user/${id}/subscriptions`);

        return data;
    }
}
