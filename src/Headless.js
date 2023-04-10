import AuthService from "./services/AuthService";
import { Outlet } from "react-router-dom";

/**
 * an empty header, used for full screen application
 * Props
 *   - selectedShow: the currently selected show
 *   - changeSelectedShow: the function to call when a different show is selected
 * @param {*} props 
 * @returns 
 */
const Headless = (props) => {

  if (!AuthService.loggedIn()) {
    props.logout();
    return (<></>);
  }

  if (!props.selectedShow) {
    return (<></>);
  }
  else {
    return (
      <>
        <Outlet />
      </>
    );
  }
}

export default Headless;
