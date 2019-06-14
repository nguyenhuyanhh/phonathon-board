import "bootstrap/dist/css/bootstrap.min.css";

import CallerList from "./CallerList";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import React from "react";
import ReactDOM from "react-dom";
import Summary from "./Summary";

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

class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <Container fluid>
          <Summary data={data} />
          <CallerList data={data} />
        </Container>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
