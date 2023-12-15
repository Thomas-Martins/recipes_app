import {useState, useEffect} from "react";
import axiosClient from "../methods/axiosClient.js";

export default function UserInfoForm() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        // console.log(data)
        setUserInfo(data)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const onUpdate = (ev) => {
    ev.preventDefault();
    updatedUser(userInfo)
  }
  const handleUpdate = (e) => {
    const {name, value} = e.target;
    console.log(value)
    setUserInfo(prevInfo => ({...prevInfo, [name]: value}));
  }

  const updatedUser = (updatedData) => {
    const userId = updatedData.id;
    axiosClient.put(`/user/${userId}`, updatedData)
      .then((response) => {
        console.log("L'utilisateur à bien été mis à jour", response.data)
        setUserInfo(updatedData)
      })
      .catch((error) => {
        console.error("Echec lors de la mise à jour", error)
      })
  }

  return (
    <div>
      <h1>Informations Personnelles</h1>
      {userInfo && (
        <form>
          <div>
            <label htmlFor="username">Nom d'utilisateur : </label>
            <input type="text" name="username" value={userInfo.username} onChange={handleUpdate}/>
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <input type="email" name="email" value={userInfo.email} onChange={handleUpdate}/>
          </div>
          <div>
            <label htmlFor="last_name">Nom : </label>
            <input type="text" name="last_name" value={userInfo.last_name} onChange={handleUpdate}/>
          </div>
          <div>
            <label htmlFor="first_name">Prénom : </label>
            <input type="text" name="first_name" value={userInfo.first_name} onChange={handleUpdate}/>
          </div>
          <button onClick={onUpdate}>Modifier mes Informations</button>
        </form>

      )}
    </div>
  )
}
