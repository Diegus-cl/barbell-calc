import React from 'react';
import PropTypes from 'prop-types';

const SelectItem = ({label, value, onChange}) => {
  return (
    <option onChange={onChange} value={value}>{label}</option>
  );
};

SelectItem.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};  

export default SelectItem;
