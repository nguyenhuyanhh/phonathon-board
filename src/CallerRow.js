import CallerPledges from "./CallerPledges";
import Col from "react-bootstrap/Col";
import PropType from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

const CallerRow = props => {
  const { Caller, pledges } = props.callerData;
  return (
    <Row>
      <Col xs={3}>{Caller}</Col>
      <CallerPledges pledges={pledges} />
    </Row>
  );
};

CallerRow.propTypes = {
  callerData: PropType.shape({
    Caller: PropType.string,
    CC: PropType.arrayOf(PropType.string),
    GIRO: PropType.arrayOf(PropType.string),
    Pledge: PropType.arrayOf(PropType.string)
  }).isRequired
};

export default CallerRow;
