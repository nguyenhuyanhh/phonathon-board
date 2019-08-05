import PropType from "prop-types";
import React from "react";

export const Link = props => (
  <a href={props.href} target="_blank" rel="noreferrer noopener">
    {props.name}
  </a>
);

Link.propTypes = {
  href: PropType.string.isRequired,
  name: PropType.string.isRequired
};
