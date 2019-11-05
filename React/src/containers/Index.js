import React, { Component, Fragment } from "react";
import Product from "./Product";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Fragment>
        <Product />
      </Fragment>
    );
  }
}

export default Home;
