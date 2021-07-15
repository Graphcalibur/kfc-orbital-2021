import React, { Component } from "react";

class UploadCode extends Component {
  state = {
    language: "",
    code: "",
  };

  uploadCode = () => {
    fetch("/api/code/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        language: "Python",
        code: "print('Hello World')",
      }),
    }).then((res) => {
      console.log(res);
    });
  };

  render() {
    return <h1 className="text">To Be Completed</h1>;
  }
}

export default UploadCode;
