import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Col } from "react-bootstrap";

const CodeLinkBtn = (props) => {
  const history = useHistory();
  const lang = props.language;
  const link =
    lang === "All Languages" ? "" : lang === "C++" ? "C%2B%2B" : lang;

  return (
    <Col md="4" className="d-grid mb-3">
      <Button
        variant="outline-info"
        onClick={() => history.push(`/solotyping/${link}`)}
      >
        <h2>{lang}</h2>
      </Button>
    </Col>
  );
};

export default CodeLinkBtn;
