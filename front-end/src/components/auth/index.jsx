import React from "react";
import { signWithGoogle } from "../../firebase";
import googleImg from "../../assets/google-signin.png";
import Spinner from "../spinner";
import "./index.css";

export default function Auth({ setAuthentication }) {
  const [showSpinner, setSpinner] = React.useState(false);

  const googleLogin = async () => {
    try {
      const res = await signWithGoogle();
      //setGoogleLoginData(res);
      setSpinner((prev) => !prev);
      getToken(res.user.email, res.user.photoURL, res.user.displayName);
      // if(res.user.email)
    } catch (e) {}
  };

  const getToken = async (email, image, name) => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        image,
        name,
      }),
    };
    const res = await fetch("http://localhost:3001/api/v1/users/auth", options);
    const data = await res.json()

    localStorage.setItem("jwt", data.token);
    setSpinner((prev) => !prev);
    setAuthentication(true);
  };

  return (
    <div>
      {showSpinner ? (
        <Spinner />
      ) : (
        <img
          src={googleImg}
          alt="google-login"
          onClick={googleLogin}
          className="google-main"
        />
      )}
    </div>
  );
}
