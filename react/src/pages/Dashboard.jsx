import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Link, Navigate} from "react-router-dom";
import {useEffect} from "react";
import axiosClient from "../methods/axiosClient.js";

export default function Dashboard() {
  const {token, user} = useStateContext()

  // useEffect(() => {
  //   axiosClient.get('/user')
  //     .then(({data}) => {
  //       console.log(data)
  //     })
  //     .catch(() => {})
  // }, []);

  if (!token) {
    return <Navigate to="/login"/>
  }

  return (
    <div>
      Dashboard
      <div>
        <Link to='/user/recipes'>Mes Recettes</Link>
        <Link to='/user/account'>Mes Informations Personnelles</Link>
      </div>
    </div>
  )
}
