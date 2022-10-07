import React, { useState, useEffect, useCallback, useRef } from "react";
import Uploader from "./uploader";
import Item from "./item";
import "./index.css";
import Spinner from "../spinner";

export default function File({ setAuthentication }) {
  const [files, setFiles] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const observer = useRef();
  const page = useRef(0);
  const total = useRef(0);

  const currentLastRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          total.current > page.current &&
          page.current !== 0
        ) {
          page.current += 1;
          getFiles();
        }
      });
      if (node) observer.current.observe(node);
    },
    [files]
  );

  const getFiles = async () => {
    setSpinner(true);
    const res = await fetch(
      "http://localhost:3001/api/v1/files/all" + `?page=${page.current}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
    const data = await res.json();
    setSpinner(false);
    if (res.status === 200) {
      total.current = data.total_pages;
      if (page.current > 0) setFiles((prev) => [...prev, ...data.data]);
      else setFiles(data.data);
    } else if (res.status === 401) {
      localStorage.removeItem("jwt");
      setAuthentication(false);
    } else {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <div className="wrapper">
          <div className="upload-btn">
            <Uploader addFile={setFiles} setSpinner={setSpinner} />
          </div>

          {files.length > 0 && <h3>My files</h3>}
          <br></br>
          {files.length > 0 &&
            files.map((e, idx) => {
              return (
                <div
                  key={idx}
                  ref={idx + 1 === files.length ? currentLastRef : null}
                >
                  <Item name={e.name} url={e.url} />
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
