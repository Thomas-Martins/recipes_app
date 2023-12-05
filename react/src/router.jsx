import {createBrowserRouter} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Recipes from "./pages/Recipes.jsx";
import NotFound from "./pages/errorPages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index/>
  },
  {
    path: 'recipes',
    element: <Recipes/>
  },
  {
    path: '*',
    element: <NotFound/>
  }
])

export default router;
