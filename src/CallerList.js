import CallerRow from "./CallerRow";
import PropType from "prop-types";
import React from "react";

const CallerList = props =>
  props.data.map((callerData, key) => (
    <CallerRow key={key} callerData={callerData} />
  ));

CallerList.propTypes = {
  data: PropType.arrayOf(PropType.any).isRequired
};

export default CallerList;
