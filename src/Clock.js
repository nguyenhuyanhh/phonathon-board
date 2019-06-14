import React from "react";

const s = secs => (secs === 1 ? "second" : "seconds");

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 30 };
  }

  render() {
    const { seconds } = this.state;
    return (
      <div>
        Refreshing in {seconds} {s(seconds)}...
      </div>
    );
  }
}

export default Clock;
