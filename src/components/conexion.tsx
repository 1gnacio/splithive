import React from "react";
import index from "../styles/index.module.css";


export default function Conexion(){
    return(
        <>
        <div className={index.conexion}>
          <a href="/login">
            <img src="/public/images/logIn.png" alt="Log In" className={index.button}/>
          </a>
          <a href="/registro">
            <img src="/public/images/signIn.png" alt="Sign In" className={index.button}/>
          </a>

          <a href="/publico">
            <img src="/public/images/help.png" alt="Help a Bee" className={index.button}/>
          </a>
        </div>

          {/* <a href="/publico">
            <img src="/public/images/help.png" alt="Sign In" className={index.button}/>
          </a> */}
      

      </>
    )
}