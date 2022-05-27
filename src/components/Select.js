import React from 'react';
import PropTypes from 'prop-types';
import SelectItem from './SelectItem';

const Select = ({name, label, options, onChange}) => {
  return (
    <div className='form__field'>
        <div className="form__label">
            <label htmlFor={name}>{label}</label>
        </div>
        <select className='select' name={name} onChange={onChange}>
        {
            options.map((option, i) => {
                return (
                    <SelectItem
                        key={i}
                        label={option.label}
                        value={option.value.toString()}
                        onChange={onchange}
                    />
                );
            })
        }
        </select>
    </div>
  );
};

Select.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

export default Select;
