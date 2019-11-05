import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export default function SignupComponent(props) {
  const spinner = (
    <Button className="my-1 mr-3 py-1 px-0" variant="primary" disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
        variant="info"
      />
      Login...
    </Button>
  );
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-7 mx-auto">
          <h3>Signup</h3>
          <form onSubmit={props.onSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username"
                onChange={props.onChange}
                name="username"
                value={props.username}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={props.onChange}
                name="email"
                value={props.email}
                required
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={props.onChange}
                name="password"
                value={props.password}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword2">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword2"
                placeholder="Confirm Password"
                onChange={props.onChange}
                name="passwordTwo"
                value={props.passwordTwo}
                required
              />
            </div>
            {props.loading ? (
              spinner
            ) : (
              <button type="submit" className="btn btn-success mr-3">
                Signup
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
