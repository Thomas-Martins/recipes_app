import {createBrowserRouter} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Recipes from "./pages/Recipes.jsx";
import NotFound from "./pages/errorPages/NotFound.jsx";
import Entrees from "./pages/Entrees.jsx";
import Plats from "./pages/Plats.jsx";
import Desserts from "./pages/Desserts.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index/>
  },
  {
    path: '/recipes',
    element: <Recipes/>,
    children:[
      {
        path: '/recipes/entrees',
        element: <Entrees/>
      },
      {
        path: '/recipes/plats',
        element: <Plats/>
      },
      {
        path: '/recipes/desserts',
        element: <Desserts/>
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
])

export default router;
