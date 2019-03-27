import CallerPledges from "./CallerPledges";
import Col from "react-bootstrap/Col";
import PropType from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

const callerStyle = {
  height: "48px",
  lineHeight: "48px",
  fontSize: "1.2rem"
};

const CallerRow = props => {
  const { caller, ...pledges } = props.callerData;
  return (
    <Row>
      <Col xs={3} style={callerStyle}>
        {caller}
      </Col>
      <Col>
        <Row>
          <CallerPledges pledges={pledges} />
        </Row>
      </Col>
    </Row>
  );
};

CallerRow.propTypes = {
  callerData: PropType.shape({
    caller: PropType.string,
    cc: PropType.arrayOf(PropType.string),
    giro: PropType.arrayOf(PropType.string),
    pledge: PropType.arrayOf(PropType.string)
  }).isRequired
};

export default CallerRow;
