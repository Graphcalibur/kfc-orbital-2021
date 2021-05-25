import React from "react";
import CodeLinkBtn from "./components/CodeLinkBtn.jsx";

const ChooseLanguage = () => {
    const langs = ["Python", "C++", "Java"];
    return <div>
        {langs.map((lang) => <CodeLinkBtn language={lang}/>)}
    </div>
}

export default ChooseLanguage;
