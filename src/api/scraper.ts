import client from "./client"

export const scrapBlog = async (baseURL: string, platform: string) => {
    const res = await client.post("/scraper", {
        baseUrl: baseURL, 
        platform: platform,
    });
    return res.data;
}