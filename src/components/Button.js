import React from 'react';
import PropTypes from 'prop-types';

const Button = ({label, className, disabled, outlined, onClick}) => {
  const wrapperClass = outlined ? `${className} outlined` : className;

  return (
    <button type="submit" className={wrapperClass} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

Button.defaultProps = {
  className: 'button button--submit',
  disabled: false,
  progress: false
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  progress: PropTypes.bool
};

export default Button;
