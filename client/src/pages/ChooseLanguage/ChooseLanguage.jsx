import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";

const ChooseLanguage = () => {
  const langs = ["Python", "C++", "Java"];
  const click = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: "abacaba123",
        password: "SpeedIAmSpeed",
      }),
    };

    fetch("http://localhost:9000/api/authuser", requestOptions);
  };

  const click2 = () => {
      fetch("http://localhost:9000/api/user/abacaba123/testauth", {credentials: "include"})
          .then(response => response.json())
          .then(data => console.log(data));
  };
  return (
    <div>
      {langs.map((lang) => (
        <CodeLinkBtn language={lang} />
      ))}
      <button onClick={click}>login as abacaba123</button>
      <button onClick={click2}>check if abacaba123 is logged in</button>
    </div>
  );
};

export default ChooseLanguage;
