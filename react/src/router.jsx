import {createBrowserRouter} from "react-router-dom";
import RecipesListByTag from "./components/RecipesListByTag.jsx";
import NotFound from "./pages/errorPages/NotFound.jsx";
import App from "./App.jsx";
import RecipeCreateForm from "./pages/recipe/RecipeCreateForm.jsx";
import Login from "./pages/authentication/Login.jsx";
import Signup from "./pages/authentication/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import UserRecipes from "./pages/UserRecipes.jsx";
import RecipeDetailForm from "./pages/recipe/RecipeDetailForm.jsx";
import RecipeDetails from "./pages/recipe/RecipeDetails.jsx";


const router = createBrowserRouter([

  // Public routes
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/recipes/entrees',
    element: <RecipesListByTag tag="entrees"/>
  },
  {
    path: '/recipes/plats',
    element: <RecipesListByTag tag="plats"/>
  },
  {
    path: '/recipes/desserts',
    element: <RecipesListByTag tag="desserts"/>
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
  //Authenticate Routes
  {
    path: '/user',
    children: [
      {
        path:'/user/dashboard',
        element: <Dashboard/>
      },
      {
        path:'/user/account',
        element: <Account/>,
      },
      {
        path: '/user/recipes',
        element: <UserRecipes/>
      }
    ]
  },
  {
    path: '/recipe',
    children: [
      {
        path:'/recipe/:id',
        element: <RecipeDetails/>
      },
      {
        path:'/recipe/modifications',
        element: <RecipeDetailForm/>
      }
    ]
  },
  //Error route
  {
    path: '*',
    element: <NotFound/>
  }
])

export default router;
