import React from "react";

export default function Navbar(props) {
  return (
    <div className="container">
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link active" href="/">
            Home
          </a>
        </li>
        {props.auth ? (
          <li className="nav-item">
            <button className="btn btn-link" onClick={props.logout}>
              logout
            </button>
          </li>
        ) : (
          <li className="nav-item">
            <a className="nav-link" href="/login">
              Login
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
