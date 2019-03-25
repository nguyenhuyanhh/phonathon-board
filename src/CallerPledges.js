import PropType from "prop-types";
import React from "react";

const CallerPledges = props => {
  return <div />;
};

CallerPledges.propType = {
  pledges: PropType.shape({
    CC: PropType.arrayOf(PropType.string),
    GIRO: PropType.arrayOf(PropType.string),
    Pledge: PropType.arrayOf(PropType.string)
  }).isRequired
};

export default CallerPledges;
