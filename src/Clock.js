import PropType from "prop-types";
import React from "react";

const s = secs => (secs === 1 ? "second" : "seconds");

class Clock extends React.Component {
  render() {
    const seconds = this.props.seconds;
    return (
      <div>
        Refreshing in {seconds} {s(seconds)}...
      </div>
    );
  }
}

Clock.propTypes = {
  seconds: PropType.number.isRequired
};

export default Clock;
