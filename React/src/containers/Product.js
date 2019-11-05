import React, { Component, Fragment } from "react";
import ProductComponent from "../components/product";
import { connect } from "react-redux";

// Actions
import { postProduct } from "../redux/actions/productAction";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: null
    };
  }
  filehandler = event => {
    this.setState({
      imageFile: event.target.files[0]
    });
  };
  fileUploader = () => {
    const fd = new FormData();
    fd.append("file", this.state.imageFile, this.state.imageFile.name);
    // debugger;
    if (!this.props.loading_product) {
      this.props.postProduct(fd);
      return true;
    }
    return false;
  };
  render() {
    return (
      <Fragment>
        <ProductComponent
          fileuploader={this.fileUploader}
          filehandler={this.filehandler}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  loading_product: state.productReducer.loading_product
});
const mapReducerToProps = { postProduct };
export default connect(
  mapStateToProps,
  mapReducerToProps
)(Product);
