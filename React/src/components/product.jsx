import React from "react";

export default function ProductComponent(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="form-group files color">
            <label>Upload Your File </label>
            <input
              type="file"
              className="form-control"
              onChange={props.filehandler}
            />
          </div>
          <button
            onClick={props.fileuploader}
            className="btn btn-success"
            type="submit"
          >
            upload
          </button>
        </div>
      </div>
    </div>
  );
}
