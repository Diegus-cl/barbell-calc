import React, { Component } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import Percentages from './components/Percentages';
import Select from './components/Select';
import './App.css';
import { Switch } from '@mui/material';
import ResultsPage from './components/ResultsPage';
import WeightsForm from './components/WeightsForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.setDefaultState();
  }

  setDefaultState() {
    return {
      PR: "",
      units: "KG", // New state to store the unit
      barOptions: this.getBarOptions("KG"), // Default to KG
      discSet: this.getDiscSet("KG"), // Default to KG disc set
      selectedBarbellOption: 20,
      targets: [''],
      barConfigurations: [],
      finalPlateSet: [],
      plateCounts: [],
      errors: {},
      saving: false,
      saved: false
    }
  }

  // Helper to get bar options based on the unit
  getBarOptions(unit) {
    return unit === "KG"
      ? [{ value: 20, label: 'Niño (20 Kg)' }, { value: 15, label: 'Niña (15 Kg)' }]
      : [{ value: 45, label: 'Niño (45 Lb)' }, { value: 35, label: 'Niña (35 Lb)' }];
  }

  // Helper to get disc sets based on the unit
  getDiscSet(unit) {
    return unit === "KG" ? [25, 20, 15, 10, 5, 2.5] : [45, 35, 25, 15, 10, 5, 2.5];
  }

  restartCalculation = e => {
    e.preventDefault();
    this.setState(this.setDefaultState());
  }

  handleSelectChange = e => {
    let selectedBarbellOption = e.target.value;
    this.setState({ selectedBarbellOption });
  };

  handlePercentageTextfield = e => {
    const percentageIndex = Number(e.target.name.substr(e.target.name.indexOf('_') + 1));
    let targets = this.state.targets;
    targets[percentageIndex] = e.target.value;

    this.setState({ targets });
  }

  handlePercentageClick = e => {
    e.preventDefault();

    let targets = [...this.state.targets];
    targets.push('');

    this.setState({ targets });
  }
  
  handleTextfield = (e) => {
    const field = e.target.name;
    let newState = this.state;
    newState[field] = e.target.value;
    this.setState(newState);
  }
  
  // New handler for switching between units
  handleUnitSwitch = () => {
    const newUnit = this.state.units === "KG" ? "LB" : "KG";
    this.setState({
      units: newUnit,
      barOptions: this.getBarOptions(newUnit),
      discSet: this.getDiscSet(newUnit),
      selectedBarbellOption: newUnit === "KG" ? 20 : 45, // Default bar weight for each unit
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const newState = {
      ...this.state
    };

    newState.discSet.sort((a, b) => b - a);
    newState.targets.sort((a, b) => a - b);
    const targetWeights = [];

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

    let finalPlatesTemp = [];

    targetWeights.forEach((tW, index) => {
      finalPlatesTemp = [...newState.finalPlateSet];
      let targetWeight = (tW - parseInt(newState.selectedBarbellOption)) / 2;

      let closestConfigWeight = parseInt(newState.selectedBarbellOption);
      newState.discSet.forEach((plate) => {
        while (targetWeight >= plate) {
          targetWeight -= plate;
          closestConfigWeight += plate * 2; // Suma dos veces el peso del disco (lado izquierdo y derecho)
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

    Object.keys(countPlatesKeys).map((value) => {
      newState.plateCounts.push({
        value,
        quantity: countPlatesKeys[value]
      });
    });

    newState.plateCounts.sort((a, b) => a.value - b.value);

    newState.saved = true;
    this.setState(newState);
  }

  render() {
    const { PR,
      barOptions,
      selectedBarbellOption,
      targets,
      plateCounts,
      barConfigurations,
      errors,
      saved,
      units // Add units state to render
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          Calculadora de Pesos
        </header>

        {
          saved &&
          <ResultsPage
            plateCounts={plateCounts}
            selectedBarbellOption={selectedBarbellOption}
            units={units} barConfigurations={barConfigurations}
            restartCalculation={this.restartCalculation}
          />
        }

        {
          !saved &&
          <WeightsForm
            onSubmit={this.onSubmit}
            PR={PR}
            handleUnitSwitch={this.handleUnitSwitch}
            handleTextfield={this.handleTextfield}
            handlePercentageClick={this.handlePercentageClick}
            handlePercentageTextfield={this.handlePercentageTextfield}
            handleSelectChange={this.handleSelectChange}
            units={units}
            targets={targets}
            barOptions={barOptions}
            errors={errors}
          />
        }
      </div>
    );
  }
}

export default App;
