import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Alerts extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate(prevProps, prevState) {
    const { message, alert, error } = this.props;
    if (message !== prevProps.message) {
      if (message) alert.success(message);
    }
    if (error !== prevProps.error) {
      if (error) alert.error(error);
    }
  }
  render() {
    return <Fragment />;
  }
}
const mapStateToProps = state => ({
  message: state.alertReducer.message,
  error: state.alertReducer.error
});

export default connect(mapStateToProps)(withAlert()(Alerts));
