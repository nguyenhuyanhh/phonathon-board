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
  constructor(props) {
    super(props);
    this.state = { data: data, clock: 30 };
  }

  tick() {
    let clock = this.state.clock;
    if (clock === 1) {
      this.setState({ clock: 30 });
    } else {
      this.setState({ clock: clock - 1 });
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { data, clock } = this.state;
    return (
      <>
        <Header clock={clock} />
        <Container fluid>
          <Summary data={data} />
          <CallerList data={data} />
        </Container>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
