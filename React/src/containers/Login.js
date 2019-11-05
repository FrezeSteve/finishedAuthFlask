import React, { Component } from "react";
import { connect } from "react-redux";

import LoginComponent from "../components/login";

// Actions
import { authLogin } from "../redux/actions/authAction";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  onChange = event => {
    const { name, value } = event.target;
    if (name === "email") {
      this.setState({
        email: value
      });
    } else if (name === "password") {
      this.setState({
        password: value
      });
    }
  };
  onSubmit = event => {
    event.preventDefault();
    const data = {
      login: {
        email: this.state.email,
        password: this.state.password
      }
    };
    if (this.state.email.length > 1 && this.state.password.length > 1) {
      this.props.authLogin(data);
      this.setState({
        email: "",
        password: ""
      });
      return true;
    }
    return false;
  };
  render() {
    return (
      <LoginComponent
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        email={this.state.email}
        password={this.state.password}
        loading={this.props.loading}
      />
    );
  }
}
const mapStateToProps = state => ({
  loading: state.authReducer.loading
});
const mapReducerToProps = {
  authLogin
};
export default connect(
  mapStateToProps,
  mapReducerToProps
)(Login);
