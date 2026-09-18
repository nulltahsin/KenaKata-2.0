import { createContext, useContext, useState } from "react";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {


  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("kenakata_user");
    const token = localStorage.getItem("token");

    if(savedUser && token){
      return JSON.parse(savedUser);
    }

    return null;

  });





  const login = async (email, password) => {


    const result = await loginUser(
      email.trim().toLowerCase(),
      password
    );


    const found = result.user;


    const safeUser = {

      id: found.user_id,

      name: found.name,

      email: email,

      role: found.role

    };



    localStorage.setItem(
      "token",
      result.token
    );


    localStorage.setItem(
      "kenakata_user",
      JSON.stringify(safeUser)
    );


    setUser(safeUser);


    return safeUser;

  };








  const register = async (data) => {


    const result = await registerUser(data);


    const found = result.user;



    const safeUser = {


      id: found.user_id,

      name: found.name,

      email: found.email,

      role: found.role


    };



    if(result.token){

      localStorage.setItem(
        "token",
        result.token
      );

    }



    localStorage.setItem(
      "kenakata_user",
      JSON.stringify(safeUser)
    );



    setUser(safeUser);



    return safeUser;


  };









  const logout = async () => {


    try{


      if(localStorage.getItem("token")){

        await logoutUser();

      }


    }
    catch(error){

      console.error(
        "Logout failed:",
        error
      );

    }




    localStorage.removeItem("token");

    localStorage.removeItem(
      "kenakata_user"
    );

    localStorage.removeItem(
      "kenakata_cart_guest"
    );



    setUser(null);


  };









  const updateUser = (updates)=>{


    const updated = {

      ...user,

      ...updates

    };


    setUser(updated);



    localStorage.setItem(

      "kenakata_user",

      JSON.stringify(updated)

    );



    return updated;


  };









  return (

    <AuthContext.Provider

      value={{

        user,

        login,

        register,

        logout,

        updateUser

      }}

    >

      {children}

    </AuthContext.Provider>

  );


}






// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){

  return useContext(AuthContext);

}