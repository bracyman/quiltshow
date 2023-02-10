import { Dropdown, DropdownButton } from "react-bootstrap";

const HamburgerMenu = (props) => {


    return (
        <DropdownButton align="end" title="Menu" id="hamburger-menu-btn" className="hamburger-menu">
            {props.children && props.children.map(item => 
                <Dropdown.Item key={item.key} onClick={item.props.onClick}>{item.props.children}</Dropdown.Item>
            )}
        </DropdownButton>
    );
};

const HamburgerMenuItem = (props) => {

    return (
        <Dropdown.Item key={props.key}>{props.children}</Dropdown.Item>
    )
};

export { HamburgerMenu, HamburgerMenuItem };