import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";

const ChooseLanguage = () => {
    const langs = ["Python", "C++", "Random"];
    return <div>
        {langs.map((lang) => <CodeLinkBtn language={lang} key={lang}/>)}
    </div>
}

export default ChooseLanguage;
