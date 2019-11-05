import React, { Component } from "react";
import { connect } from "react-redux";

import SignupComponent from "../components/signup";

// Actions
import { authSignup } from "../redux/actions/authAction";
import { ErrorDispatch } from "../redux/actions/errorAction";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordTwo: "",
      error: ""
    };
  }
  onChange = event => {
    const { name, value } = event.target;
    if (name === "email") {
      this.setState({
        email: value
      });
    }
    if (name === "username") {
      this.setState({
        username: value
      });
    }
    if (name === "password") {
      this.setState({
        password: value
      });
    }
    if (name === "passwordTwo") {
      this.setState({ passwordTwo: value });
    }
  };
  onSubmit = event => {
    event.preventDefault();
    this.setState({
      error: null
    });
    if (this.state.password !== this.state.passwordTwo) {
      this.props.ErrorDispatch({ error: "The passwords don't match" });
      return false;
    } else {
      const data = {
        user: {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        }
      };
      this.props.authSignup(data);
    }
    this.setState({
      username: "",
      email: "",
      password: "",
      passwordTwo: ""
    });
  };
  render() {
    return (
      <React.Fragment>
        <SignupComponent
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          username={this.state.username}
          email={this.state.email}
          password={this.state.password}
          passwordTwo={this.state.passwordTwo}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.token !== null,
  error: state.authReducer.error,
  loading: state.authReducer.loading
});
const mapReducerToProps = {
  authSignup,
  ErrorDispatch
};
export default connect(
  mapStateToProps,
  mapReducerToProps
)(Signup);
