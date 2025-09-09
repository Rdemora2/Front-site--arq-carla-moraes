import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

/* This just wraps react-modal to allow styling the modal overlay, you shouldn't have the need to change this at all */
const ReactModalAdapter = ({ className, ...props }) => {
  const contentClassName = `${className}__content`;
  const overlayClassName = `${className}__overlay`;
  return (
    <Modal
      className={contentClassName}
      overlayClassName={overlayClassName}
      {...props}
    />
  );
};

ReactModalAdapter.propTypes = {
  className: PropTypes.string.isRequired,
};

export default ReactModalAdapter;
