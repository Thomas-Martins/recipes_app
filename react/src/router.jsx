import {createBrowserRouter} from "react-router-dom";
import RecipesList from "./components/RecipesList.jsx";
import NotFound from "./pages/errorPages/NotFound.jsx";
import App from "./App.jsx";
import RecipeCreateForm from "./pages/RecipeCreateForm.jsx";
import Login from "./pages/authentication/Login.jsx";
import Signup from "./pages/authentication/Signup.jsx";


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
    path: '/recipes/create',
    element: <RecipeCreateForm/>
  },
  //Authentication routes
  {
    path:'/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  //Error route
  {
    path: '*',
    element: <NotFound/>
  }
])

export default router;
