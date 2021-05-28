import React from 'react';
import Timer from "./Timer";

const Header = (props) => {
    return <div className="d-flex flex-sm-row gap-5">
        <b className="text">
            Language: {props.language}
        </b>

        <Timer elapsed_time={props.elapsed_time} typing={props.typing} />
    </div>
}

export default Header; 