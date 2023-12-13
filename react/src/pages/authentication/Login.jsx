import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {Link, Navigate} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../../methods/axiosClient.js";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {token, setToken, setUser} = useStateContext()
  if (token) {
    return <Navigate to="/"/>
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setErrors(null)
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(e => {
        const response = e.response;
        if(response && response.status === 422){
          if(response.data.errors){
            setErrors(response.data.errors)
          }else{
            setErrors({
              email: [response.data.message]
            })
          }
        }
      })
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Connexion à votre compte</h1>
        {errors &&
          <div>
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        <input ref={emailRef} type="email" placeholder="Email"/>
        <input ref={passwordRef} type="password" placeholder="Mot de passe"/>
        <button onClick={onSubmit}>Se connecter</button>
      </form>
      <div>
        <h4>Vous n'êtes pas encore inscrit ?</h4>
        <Link to="/signup">Je veux crée un compte!</Link>
      </div>
    </div>
  )
}
