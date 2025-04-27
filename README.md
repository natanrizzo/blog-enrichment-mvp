# Frontend for Web Scraper with AI Resume

This frontend application is built with **React**, **Vite**, and **TypeScript**. It serves as a user interface for interacting with the web scraper backend. The frontend allows you to:

- Create and manage blog XPaths and URLs for the scraper.
- View and edit scraped posts.
- Use AI to generate summaries (resumes) for the scraped content.
- Save modified posts back to the backend.

## Features

- **Create and manage blog XPaths and URLs**: Configure blog scraping settings.
- **View and edit scraped posts**: Access and modify the posts that have been scraped.
- **AI Resume**: Use AI to generate a summarized version of the scraped content.
- **Save changes to the backend**: After editing the post content or generating the AI summary, you can save the changes back to the backend.

## Installation

1. Clone the repository:

``` bash
  git clone https://github.com/natanrizzo/blog-enrichment-mvp.git
```

2. Navigate to the project directory:

``` bash
  cd blog-enrichment-mvp
```


3. Install the dependencies:

``` bash
  npm install
```


4. Set up environment variables for connecting to the backend API.

## Configuration

Ensure you have the following environment variables set in your `.env` file:

``` bash
  VITE_API_BASE_URL=<URL of the backend>
```

## Scripts

Here are the available commands you can run:

- `npm run dev`: Starts the development server with Vite.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the built application (for production mode).

**Example:**

```
  npm run dev
```

This command will start the development server at [http://localhost:5173](http://localhost:5173).

## Usage

- **Create Blog XPaths and URLs:** From the UI, define XPaths and URLs that will be used by the backend scraper to extract content from the selected blogs.
- **View Scraped Posts:** View the posts that the scraper has collected. The UI lists all posts, and you can click on a post to edit its content.
- **Edit Post Content:** Modify the content of a post directly in the UI, including text or other elements.
- **Generate AI Summary:** After selecting a post, use AI to generate a summarized version of the content. You can choose between different AI models (e.g., OpenAI and Deepseek).
- **Save Post:** After editing or generating a summary, save the post back to the backend with the updated content.

## Example Flow

1. **Create New Blog Configuration:** Define a new blog by adding its XPath and URL in the application.
2. **Scrape Blog Posts:** Initiate the scraping process to pull in blog posts from the configured URLs.
3. **Edit Post:** View and modify the post content in the UI.
4. **Generate AI Summary:** Use the AI feature to generate a summarized version of the post content.
5. **Save Post:** Save the edited or summarized post back to the backend.

## Development

To run the app in development mode:

``` bash
  npm run dev
```


This will start the Vite development server, accessible at [http://localhost:5173](http://localhost:5173).

## Build

To build the project for production:

``` bash
  npm run build
```


This generates production-ready files in the `dist` directory.

To preview the production build:

``` bash
  npm run preview
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
