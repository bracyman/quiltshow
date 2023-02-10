import React, { Component } from "react";
import "./App.css";
import DateUtils from "./utilities/DateUtils";

const Home = (props) => {


  if(!props.show) {
    return <div></div>;
  }
  else {
    return <>
      <div><b>Date:</b> {DateUtils.format(props.show.startDate)} - {DateUtils.format(props.show.endDate)}</div>
      <div>
        {props.show.description}
      </div>
    </>
  }
}
export default Home;
