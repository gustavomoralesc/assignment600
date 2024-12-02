import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload.js";
import Child1 from "./Child1.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:null,
    };
  }

  set_data = (csv_data) => {
    console.log("Setting Data in Parent:", csv_data); // Debugging

    this.setState({ data: csv_data });
  }

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <Child1 csv_data={this.state.data}></Child1>
        </div>
      </div>
    );
  }
}

export default App;