export class BlogXPathDTO {
    baseUrl: string;
    platform: string;
    xPath: {
        indexUrl: string;
        itemXPath: string;
        paginationNextXPath: string;
        titleXPath: string;
        contentXPath: string;
        authorXPath: string;
        dateXPath: string;
        paginationLimit: number;
    }
}