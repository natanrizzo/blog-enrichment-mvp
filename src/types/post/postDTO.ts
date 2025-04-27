export default class PostDTO {
    id: number;
    blogId: number;
    externalId: string;
    author: string;
    content: string;
    creationDate: string;
    publishedAt: string;
    title: string;
    extraData: string;
    blog?: {
        baseUrl: string;
    }
}