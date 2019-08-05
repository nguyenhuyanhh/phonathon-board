import Col from "react-bootstrap/Col";
import PropType from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

const calcTotal = (array, key) =>
  array
    .reduce((list, obj) => list.concat(obj[key]), [])
    .reduce((totalAmt, amt) => totalAmt + parseInt(amt), 0);

const displayMapping = {
  cc: "CC",
  giro: "GIRO",
  pledge: "Pledge"
};

const style = {
  fontSize: "1.5em",
  textAlign: "center"
};

class Summary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="my-3">
        {["cc", "giro", "pledge"].map(type => (
          <Col key={type} style={style}>
            Total {displayMapping[type]}: ${calcTotal(this.props.data, type)}
          </Col>
        ))}
      </Row>
    );
  }
}

Summary.propTypes = {
  data: PropType.arrayOf(PropType.any).isRequired
};

export default Summary;
