import React from 'react';

const Header = (props) => {
    return <b className="text">
        Language: {props.language}
    </b>
}

export default Header;