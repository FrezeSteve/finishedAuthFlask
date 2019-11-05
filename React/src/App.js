import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./containers/Alerts";

// Actions
import { getSession, sessionCheckState } from "./redux/actions/sessionAction";
import { logout, authCheckState } from "./redux/actions/authAction";

import "bootstrap/dist/css/bootstrap.min.css";

// assets
import routes from "./routes";

import Navbar from "./components/navbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit_session: 0
    };
  }
  componentDidMount() {
    this.props.getSession({ session: {} });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      typeof this.props.session.session_id === "undefined" &&
      !this.props.loading_session &&
      this.state.limit_session < 20
    ) {
      this.props.getSession({ session: {} });
      this.setState(prev => {
        prev.limit_session = this.state.limit_session + 1;
      });
    }
  }
  render() {
    this.props.sessionCheckState();
    this.props.authCheckState();
    const alertOptions = {
      timeout: 3000,
      position: "middle"
    };
    return (
      <Provider template={AlertTemplate} {...alertOptions}>
        <Navbar auth={this.props.isAuthenticated} logout={this.props.logout} />
        <Alerts />
        <Router>
          <Switch>
            {routes.map(route => (
              <Route
                key={route.id}
                path={route.path}
                component={route.component}
                exact={route.exact}
                strict={route.strict}
              />
            ))}
          </Switch>
        </Router>
      </Provider>
    );
  }
}
const mapStateToProps = state => ({
  // session
  session: state.sessionReducer.session,
  loading_session: state.sessionReducer.loading_session,
  // auth
  isAuthenticated: state.authReducer.token !== null
});
const mapReducerToProps = {
  getSession,
  sessionCheckState,
  authCheckState,
  logout
};
export default connect(
  mapStateToProps,
  mapReducerToProps
)(App);
