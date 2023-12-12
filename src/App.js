


import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Recipes from "./pages/Recipes";
import Test from './pages/Test';
import AddMoreServings from "./pages/AddMoreServings";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Recipes />}>
          {/* <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
        <Route path="recipes" element={<Recipes />} />
        <Route path="upload" element={<Home />} />
        <Route path="test" element={<Test />} />
        <Route path="add-more-servings" element={<AddMoreServings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;