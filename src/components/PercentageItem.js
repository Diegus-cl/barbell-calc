import React from 'react';
import PropTypes from 'prop-types';
import TextField from './TextField';

const PercentageItem = ({parentKey, percentageId, percentageValue, onChange, isPercentagesCalculation}) => {
  return (
    <div>
        <TextField
            type="text"
            name={percentageId}
            value={percentageValue}
            label={`${isPercentagesCalculation ? "Porcentaje" : "Peso"} #${(parentKey + 1)}`}
            placeholder="e.g. 80"
            required={false}
            // error={errors.tempTarget}
            onChange={onChange}
            />
    </div>
  );
};

PercentageItem.propTypes = {
    parentKey: PropTypes.number,
    percentageId: PropTypes.string.isRequired,
    percentageValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};  

export default PercentageItem;
