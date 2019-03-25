import CallerList from "./CallerList";
import Header from "./Header";
import React from "react";
import ReactDOM from "react-dom";

const data = [
  {
    Caller: "Test",
    CC: ["10", "10", "10"],
    GIRO: ["10", "10", "10"],
    Pledge: ["10", "10", "10"]
  },
  {
    Caller: "Test2",
    CC: ["10", "10", "10"],
    GIRO: ["10", "10", "10"],
    Pledge: ["10", "10", "10"]
  }
];

const App = () => {
  return (
    <>
      <Header />
      <CallerList data={data}/>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
