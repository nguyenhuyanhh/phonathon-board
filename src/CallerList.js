import CallerRow from "./CallerRow";
import PropType from "prop-types";
import React from "react";

const CallerList = props => {
  return props.data.map((callerData, key) => {
    return <CallerRow key={key} callerData={callerData} />;
  });
};

CallerList.propTypes = {
  data: PropType.arrayOf(PropType.any)
};

export default CallerList;
