import React from 'react';
import { useHistory } from "react-router-dom";

const CodeLinkBtn = (props) => {
    const history = useHistory();
    const lang = props.language;
    const link = lang === "Random" ? "" : lang;

    return <button className="btn me-2 btn-primary" onClick={() => history.push(`/solotyping/${link}`)}>
        {lang}
    </button>
}

export default CodeLinkBtn;