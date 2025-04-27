import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import NotFound from "./pages/NotFound";
import PostPage from "./pages/postPage";
import CreateBlogPage from "./pages/createBlogPage";
import EditBlogPage from "./pages/editBlogPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<CreateBlogPage />} />
      <Route path="/blogs/:blogId" element={<EditBlogPage />} />
      <Route path="/posts/:postId" element={<PostPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
