import React from "react";
import fileicon from "../../../assets/file.png";
import imgicon from "../../../assets/img.png";
import "./index.css";

export default function Item({ name, url }) {
  const downloadFile = async () => {
    const res = await fetch("http://localhost:3001/api/v1/files/url/" + name, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });
    const data = await res.json();
    if (res.status === 200) {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((href) => {
          Object.assign(document.createElement("a"), {
            href,
            download: name,
          }).click();
        });
    }
  };

  const isImage = () => {
    const formats = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    for (const format of formats) {
      if (name.includes(format)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="item">
      <img src={isImage() ? imgicon : fileicon} className="img-icon" />
      <div style={{ padding: "0px 10px" }}>{name}</div>
      <button onClick={downloadFile}>Download</button>
    </div>
  );
}
