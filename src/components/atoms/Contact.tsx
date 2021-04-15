import React from "react"
import github from "../../images/github.svg";
import twitter from "../../images/twitter.svg";
import {Link} from "react-router-dom";
import gmail from "../../images/gmail.svg";

const Contact = () => {
    return (
        <div className="contact">
            <a href="https://github.com/NamesRunOut" target="_blank" rel="noopener noreferrer"><img src={github}
                                                                                                    className="contactImage"
                                                                                                    alt="github"/></a>
            <a href="https://twitter.com/NamesRunOut" target="_blank" rel="noopener noreferrer"><img src={twitter}
                                                                                                     className="contactImage"
                                                                                                     alt="twitter"/></a>
            <Link to="/contact">
                <img src={gmail} className="contactImage" alt="mail"/>
            </Link>
        </div>
    );
}

export default Contact