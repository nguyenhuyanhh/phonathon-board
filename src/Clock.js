import PropType from "prop-types";
import React from "react";

const CLOCK = 10;
const s = secs => (secs === 1 ? "second" : "seconds");

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clock: CLOCK };
  }

  tick() {
    let clock = this.state.clock;
    if (clock === 1) {
      this.setState({ clock: CLOCK });
      this.props.onClockReset();
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
    const { clock } = this.state;
    return (
      <div>
        Refreshing in {clock} {s(clock)}...
      </div>
    );
  }
}

Clock.propTypes = {
  onClockReset: PropType.func.isRequired
};

export default Clock;
