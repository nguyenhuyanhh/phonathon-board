import "bootstrap/dist/css/bootstrap.min.css";

import CallerList from "./CallerList";
import Header from "./Header";
import React from "react";
import ReactDOM from "react-dom";

const data = [
  {
    caller: "Test",
    cc: ["10", "10", "10"],
    giro: ["10", "10", "10"],
    pledge: ["10", "10", "10"]
  },
  {
    caller: "Test2",
    cc: ["10", "10", "10"],
    giro: ["10", "10", "10"],
    pledge: ["10", "10", "10"]
  }
];

const App = () => {
  return (
    <>
      <Header />
      <CallerList data={data} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
