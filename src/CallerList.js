import CallerRow from "./CallerRow";
import Container from "react-bootstrap/Container";
import PropType from "prop-types";
import React from "react";

const CallerList = props => {
  return (
    <Container fluid>
      {props.data.map((callerData, key) => {
        return <CallerRow key={key} callerData={callerData} />;
      })}
    </Container>
  );
};

CallerList.propTypes = {
  data: PropType.arrayOf(PropType.any)
};

export default CallerList;
