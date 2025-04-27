export type BlogFormValues = {
    blogUrl: string;
    indexUrl: string;
    itemXPath: string;
    paginationNextXPath?: string;
    titleXPath: string;
    contentXPath: string;
    authorXPath?: string;
    dateXPath?: string;
    paginationLimit: number;
};
