import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";
import { Container, Row } from "react-bootstrap";

const ChooseLanguage = () => {
  const langs = ["Python", "C++", "All Languages"];
  return (
    <Container fluid="sm" className="shadow p-4 mt-3 box">
      <b className="text">Select the language to practice on:</b>
      <Row className="mt-3 justify-content-evenly">
        {langs.map((lang) => (
          <CodeLinkBtn language={lang} key={lang} id={lang} />
        ))}
      </Row>
    </Container>
  );
};

export default ChooseLanguage;
