import React, { useState } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import Percentages from './components/Percentages';
import Select from './components/Select';
import './App.css';
import { Switch } from '@mui/material';
import ResultsPage from './components/ResultsPage';
import WeightsForm from './components/WeightsForm';

const App = () => {
  const [isPercentagesCalculation, setIsPercentageCalculation] = useState(true)

  const setDefaultState = () => ({
    PR: "",
    units: "KG",
    barOptions: getBarOptions("KG"),
    discSet: getDiscSet("KG"),
    selectedBarbellOption: 20,
    targets: [''],
    barConfigurations: [],
    finalPlateSet: [],
    plateCounts: [],
    errors: {},
    saving: false,
    saved: false
  });

  const getBarOptions = (unit) => {
    return unit === "KG"
      ? [{ value: 20, label: 'Niño (20 Kg)' }, { value: 15, label: 'Niña (15 Kg)' }]
      : [{ value: 45, label: 'Niño (45 Lb)' }, { value: 35, label: 'Niña (35 Lb)' }];
  };

  const getDiscSet = (unit) => {
    return unit === "KG" ? [25, 20, 15, 10, 5, 2.5] : [45, 35, 25, 15, 10, 5, 2.5];
  };

  const [state, setState] = useState(setDefaultState);

  const restartCalculation = (e) => {
    e.preventDefault();
    setState(setDefaultState());
  };

  const handleSelectChange = (e) => {
    const selectedBarbellOption = e.target.value;
    setState((prevState) => ({ ...prevState, selectedBarbellOption }));
  };

  const handlePercentageTextfield = (e) => {
    const percentageIndex = Number(e.target.name.substr(e.target.name.indexOf('_') + 1));
    let targets = [...state.targets];
    targets[percentageIndex] = e.target.value;

    setState((prevState) => ({ ...prevState, targets }));
  };

  const handlePercentageClick = (e) => {
    e.preventDefault();
    let targets = [...state.targets];
    targets.push('');
    setState((prevState) => ({ ...prevState, targets }));
  };

  const handleTextfield = (e) => {
    const field = e.target.name;
    setState((prevState) => ({ ...prevState, [field]: e.target.value }));
  };

  const handleUnitSwitch = () => {
    const newUnit = state.units === "KG" ? "LB" : "KG";
    setState((prevState) => ({
      ...prevState,
      units: newUnit,
      barOptions: getBarOptions(newUnit),
      discSet: getDiscSet(newUnit),
      selectedBarbellOption: newUnit === "KG" ? 20 : 45
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let newState = { ...state };

    newState.discSet.sort((a, b) => b - a);
    newState.targets.sort((a, b) => a - b);
    const targetWeights = [];

    if (isPercentagesCalculation) {
      newState.targets.forEach((targetPercentage, index) => {
        let tW = Math.round(parseInt(newState.PR) * targetPercentage / 100);
        let pW = tW + (tW % 5 <= 2 ? -1 * tW % 5 : 5 - (tW % 5)); // training approach, above or below approximation; <= 2 goes beyond
        targetWeights.push(pW);
        newState.barConfigurations[index] = {
          percentage: targetPercentage,
          accuratePercentage: tW,
          roundPercentage: targetWeights[index],
          plates: []
        };
      });
    } else {
      // Is a manual weight input
      newState.targets.forEach((targetWeight, index) => {
        const tW = Number(targetWeight)
        let roundedWeight = tW + (tW % 5 <= 2 ? -1 * tW % 5 : 5 - (tW % 5)); // training approach, above or below approximation; <= 2 goes beyond
        targetWeights.push(roundedWeight);
        newState.barConfigurations[index] = {
          percentage: 100,
          accuratePercentage: targetWeight,
          roundPercentage: targetWeights[index],
          plates: []
        };
      });
    }

    let finalPlatesTemp = [];

    targetWeights.forEach((tW, index) => {
      finalPlatesTemp = [...newState.finalPlateSet];
      let targetWeight = (tW - parseInt(newState.selectedBarbellOption)) / 2;

      let closestConfigWeight = parseInt(newState.selectedBarbellOption);
      newState.discSet.forEach((plate) => {
        while (targetWeight >= plate) {
          targetWeight -= plate;
          closestConfigWeight += plate * 2;
          newState.barConfigurations[index].plates.push(plate);

          const foundPlateIndex = finalPlatesTemp.indexOf(plate);
          if (foundPlateIndex > -1) {
            finalPlatesTemp.splice(foundPlateIndex, 1);
          } else {
            newState.finalPlateSet.push(plate);
          }
        }
      });

      newState.barConfigurations[index].closestConfig = closestConfigWeight;
    });

    let countPlatesKeys = [];
    newState.finalPlateSet.forEach((x) => {
      countPlatesKeys[x] = (countPlatesKeys[x] || 0) + 1;
    });

    Object.keys(countPlatesKeys).forEach((value) => {
      newState.plateCounts.push({
        value,
        quantity: countPlatesKeys[value]
      });
    });

    newState.plateCounts.sort((a, b) => a.value - b.value);

    newState.saved = true;
    setState(newState);
  };

  const { PR, barOptions, selectedBarbellOption, targets, plateCounts, barConfigurations, errors, saved, units } = state;

  return (
    <div className="App">
      <header className="App-header">Calculadora de Pesos</header>

      {saved ? (
        <ResultsPage
          plateCounts={plateCounts}
          selectedBarbellOption={selectedBarbellOption}
          units={units}
          barConfigurations={barConfigurations}
          restartCalculation={restartCalculation}
        />
      ) : (
        <WeightsForm
          onSubmit={onSubmit}
          PR={PR}
          handleUnitSwitch={handleUnitSwitch}
          handleTextfield={handleTextfield}
          handlePercentageClick={handlePercentageClick}
          handlePercentageTextfield={handlePercentageTextfield}
          handleSelectChange={handleSelectChange}
          units={units}
          targets={targets}
          isPercentagesCalculation={isPercentagesCalculation}
          setIsPercentageCalculation={setIsPercentageCalculation}
          barOptions={barOptions}
          errors={errors}
        />
      )}
    </div>
  );
};

export default App;
