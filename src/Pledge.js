import PropType from "prop-types";
import React from "react";

const colorMapping = {
  cc: "red",
  giro: "green",
  pledge: "blue"
};

const Pledge = props => {
  const style = {
    color: colorMapping[props.type],
    border: 2,
    borderStyle: "solid",
    borderRadius: "50%",
    borderColor: colorMapping[props.type],
    fontSize: "1rem",
    width: "42px",
    height: "42px",
    lineHeight: "42px",
    textAlign: "center",
    margin: "3px"
  };
  return (
    <div style={style}>
      {props.amount}
    </div>
  );
};

Pledge.propTypes = {
  amount: PropType.string.isRequired,
  type: PropType.oneOf(["cc", "giro", "pledge"]).isRequired
};

export default Pledge;
