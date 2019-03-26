import PropType from "prop-types";
import React from "react";

const Summary = props => {
  const totalCC = props.data
    .reduce((ccList, callerData) => ccList.concat(callerData.cc), [])
    .reduce((totalAmt, amt) => totalAmt + parseInt(amt), 0);
  return <div>{totalCC}</div>;
};

Summary.propTypes = {
  data: PropType.arrayOf(PropType.any).isRequired
};

export default Summary;
