import React from 'react';
import PropTypes from 'prop-types';
import PercentageItem from './PercentageItem';

const Percentages = ({percentages, onTextChange, onClick}) => {
  return (
    <div>
      {
        percentages.map((percentage, i) => {
          //console.log(percentage);
          return (
            <PercentageItem
              key={i}
              parentKey={i}
              percentageId={'percentageId_' + i.toString()}
              percentageValue={percentages[i]}
              onChange={onTextChange} />
          );
        })
      }

      <div className="form__field form__field--button">
        <button className="button button--outlined" onClick={onClick}>
            +
            <span>Agregar Porcentaje</span>
        </button>
      </div>
    </div>
  );
};

Percentages.propTypes = {
    percentages: PropTypes.array.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

export default Percentages;
