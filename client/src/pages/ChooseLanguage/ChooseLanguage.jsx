import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";

const ChooseLanguage = () => {
    const langs = ["Python", "C++", "All Languages"];
    return <div className="shadow p-4 container-sm mt-3 box">
        <b>
            Select the language to practice on:
        </b>
        <div className="row mt-3 justify-content-evenly">
            {langs.map((lang) => <CodeLinkBtn language={lang} key={lang}/>)}
        </div>
    </div>
}

export default ChooseLanguage;
