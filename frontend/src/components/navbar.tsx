import React, { ReactFragment } from 'react';

export interface Props {
    totalCounters: number;
}

const NavBar = (props: Props) => {
    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar
                    <span className={"badge badge-pill badge-secondary"}>
                    {props.totalCounters}
                </span>
                </a>
            </nav>
        </div>
    );
}

export default NavBar;