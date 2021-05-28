import React from 'react';
import { useHistory } from "react-router-dom";

const CodeLinkBtn = (props) => {
    const history = useHistory();
    const lang = props.language;
    const link = lang === "All Languages" ? "" : lang;

    return <div className="d-grid col-4">
        <button className="btn btn-primary" onClick={() => history.push(`/solotyping/${link}`)}>
            <h2>{lang}</h2>
        </button>
    </div>
}

export default CodeLinkBtn;