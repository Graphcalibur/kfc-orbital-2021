import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";
import { Container, Row } from "react-bootstrap";

const ChooseLanguage = () => {
  const langs = [
    "Python",
    "C++",
    "Java",
    "Ruby",
    "Javascript",
    "PHP",
    "All Languages",
  ];
  return (
    <Container>
      <h3 className="text">
        <b>Select a language to practice on:</b>
      </h3>
      <Container fluid="lg" className="p-4 mt-3 box">
        <Row className="justify-content-evenly">
          {langs.map((lang) => (
            <CodeLinkBtn language={lang} key={lang} id={lang} />
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default ChooseLanguage;
