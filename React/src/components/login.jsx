import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export default function LoginComponent(props) {
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
        <div className="col-12 col-sm-6 mx-auto">
          <h3>Login</h3>
          <form onSubmit={props.onSubmit}>
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
            {props.loading ? (
              spinner
            ) : (
              <button type="submit" className="btn btn-primary mr-3">
                Login
              </button>
            )}
            or
            <a className="btn btn-link" href="/signup">
              Signup
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
