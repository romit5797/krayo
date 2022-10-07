import React from "react";
import "./index.css";
import icon from "../../../assets/upload.png";

function Uploader({ addFile, setSpinner }) {
  const uploadFile = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    setSpinner(true);
    const res = await fetch("http://localhost:3001/api/v1/files/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    const data = await res.json();
    setSpinner(false);
    console.log(res)
    if (res.status === 200) {
      addFile((prev) => [...prev, data.data]);
    } else {
      alert("File upload failed. Something went wrong");
    }
  };

  return (
    <div className="image-upload">
      <label htmlFor="file-input">
        <div className="label-wrapper">
          <img src={icon} alt="upload" className="img" />
          <div className="label-text">Upload file</div>
        </div>
      </label>

      <input
        id="file-input"
        type="file"
        onChange={(e) => uploadFile(e.target.files[0])}
      />
    </div>
  );
}

export default Uploader;
