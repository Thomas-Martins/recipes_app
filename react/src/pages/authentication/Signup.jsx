import {Link, Navigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {useRef, useState} from "react";
import axiosClient from "../../methods/axiosClient.js";

export default function Signup() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const {token, setUser, setToken} = useStateContext();

  if (token) {
    return <Navigate to="/"/>
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    axiosClient.post('/signup', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(e => {
        const response = e.response;
        if(response && response.status === 422){
          setErrors(response.data.errors)
        }
      })
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Inscrivez-vous gratuitement!</h1>
        {errors &&
          <div>
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        <input ref={emailRef} type="email" placeholder="Email"/>
        <input ref={usernameRef} type="text" placeholder="Nom d'utilisateur"/>
        <input ref={firstNameRef} type="text" placeholder="Prénom"/>
        <input ref={lastNameRef} type="text" placeholder="Nom de famille"/>
        <input ref={passwordRef} type="password" placeholder="Mot de passe"/>
        <input ref={passwordConfirmationRef} type="password" placeholder="Confirmation du mot de passe"/>
        <button onClick={onSubmit}>S'inscrire</button>
      </form>
      <div>
        <h4>Vous avez déjà un compte?</h4>
        <Link to="/login">Connectez-vous !</Link>
      </div>
    </div>
  )
}
