import Pledge from "./Pledge";
import PropType from "prop-types";
import React from "react";

const CallerPledges = props => {
  const { cc: ccList, giro: giroList, pledge: pledgeList } = props.pledges;
  return ccList
    .map((amount, key) => (
      <Pledge type="cc" amount={amount} key={`cc-${key}`} />
    ))
    .concat(
      giroList
        .map((amount, key) => (
          <Pledge type="giro" amount={amount} key={`giro-${key}`} />
        ))
        .concat(
          pledgeList.map((amount, key) => (
            <Pledge type="pledge" amount={amount} key={`pledge-${key}`} />
          ))
        )
    );
};

CallerPledges.propTypes = {
  pledges: PropType.shape({
    cc: PropType.arrayOf(PropType.string),
    giro: PropType.arrayOf(PropType.string),
    pledge: PropType.arrayOf(PropType.string)
  }).isRequired
};

export default CallerPledges;
