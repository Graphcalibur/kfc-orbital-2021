import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";
import { Container, Row } from "react-bootstrap";

const ChooseLanguage = () => {
/* ===Example user authentication code===
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
*/
  const langs = ["Python", "C++", "All Languages"];
  return (
    <Container fluid="sm" className="shadow p-4 mt-3 box">
      <b className="text">Select the language to practice on:</b>
      <Row className="mt-3 justify-content-evenly">
        {langs.map((lang) => (
          <CodeLinkBtn language={lang} key={lang} />
        ))}
      </Row>
    </Container>

  );
};

export default ChooseLanguage;
