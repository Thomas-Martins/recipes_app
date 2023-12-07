import {createBrowserRouter} from "react-router-dom";

import RecipesList from "./components/RecipesList.jsx";
import NotFound from "./pages/errorPages/NotFound.jsx";
import App from "./App.jsx";


const router = createBrowserRouter([

  // Public routes
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/recipes/entrees',
    element: <RecipesList tag="entrees"/>
  },
  {
    path: '/recipes/plats',
    element: <RecipesList tag="plats"/>
  },
  {
    path: '/recipes/desserts',
    element: <RecipesList tag="desserts"/>
  },
  {
    path: '*',
    element: <NotFound/>
  }
])

export default router;
