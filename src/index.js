import "bootstrap/dist/css/bootstrap.min.css";

import CallerList from "./CallerList";
import Container from "react-bootstrap/Container";
import Header from "./Header";
import React from "react";
import ReactDOM from "react-dom";
import Summary from "./Summary";

const URL =
  "https://spreadsheets.google.com/feeds/cells/1btD0w0p58ZNJzSfDRGtCiZCCjvK80OkLKOA0j9YXbic/2/public/values?alt=json";

function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

function parse(results) {
  let cells = results.feed.entry.map(x => x["gs$cell"]);
  let records = Object.values(groupBy(cells, "row")).slice(1);
  return records.map(function(x) {
    let caller = x.filter(f => f.col == 1);
    let cc = x.filter(f => f.col == 2);
    let pl = x.filter(f => f.col == 3);
    let giro = x.filter(f => f.col == 4);
    return {
      caller: caller[0]["$t"].trim(),
      cc: cc.length ? cc[0]["$t"].split(",") : cc,
      pledge: pl.length ? pl[0]["$t"].split(",") : pl,
      giro: giro.length ? giro[0]["$t"].split(",") : giro
    };
  });
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.update = this.update.bind(this);
    this.update();
  }

  update() {
    fetch(URL)
      .then(res => res.json())
      .then(results => {
        this.setState({ data: parse(results) });
      });
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <Header onClockReset={this.update} />
        <Container fluid>
          <Summary data={data} />
          <CallerList data={data} />
        </Container>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
