import { useState } from "react";
import "./App.css";
import Auth from "./components/auth";
import File from "./components/files";

function App() {
  const [isAuthenticated, setAuthentication] = useState(
    localStorage.getItem("jwt")
  );
  return <div className="App">{!isAuthenticated ? <Auth setAuthentication={setAuthentication} /> : <File setAuthentication={setAuthentication}/>}</div>;
}

export default App;
