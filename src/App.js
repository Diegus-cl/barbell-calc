import React, { Component } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import Percentages from './components/Percentages';
import Select from './components/Select';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.setDefaultState();
  }

  setDefaultState() {
    return {
      PR: "",
      barOptions: [
        { value: 35, label: 'Niña (35 Lb)' },
        { value: 45, label: 'Niño (45 Lb)' }
      ],
      selectedBarbellOption: 35,
      discSet: [45, 35, 25, 15, 10, 5, 2.5],
      targets: [''],
      barConfigurations: [],
      finalPlateSet: [],
      plateCounts: [],
      errors: {},
      saving: false,
      saved: false
    }
  }

  restartCalculation = e => {
    e.preventDefault();
    this.setState(this.setDefaultState);
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

  handleTextfield = e => {
    const field = e.target.name;
    let newState = this.state;
    newState[field] = e.target.value;
    this.setState(newState);
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
      let tW = Math.round(parseInt(newState.PR) * targetPercentage/100);
      targetWeights.push(tW - tW % 5) // delete `% 5` for 100% accuracy
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

      newState.discSet.forEach((plate) => {
        while (targetWeight >= plate) {
          targetWeight -= plate;
          newState.barConfigurations[index].plates.push(plate);

          const foundPlateIndex = finalPlatesTemp.indexOf(plate);
          if (foundPlateIndex > -1) {
            finalPlatesTemp.splice(foundPlateIndex, 1);
          } else {
            newState.finalPlateSet.push(plate);
          }
        }
      });
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

    newState.plateCounts.sort((a,b) => a.value - b.value);

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
      saved
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          CFM Calculadora
        </header>

        {
          saved &&
            <div className='wrapper wrapper--form'>
              <h2>Equipos necesarios</h2>
              <ul>
                <li key={-1}>Barra de {selectedBarbellOption} Lb</li>
                {
                  plateCounts.map((item, index) => (
                    <li key={index}>{item.quantity * 2} discos de {item.value} Lb</li> 
                  ))
                }
              </ul>
              <h2>Configuración de porcentajes</h2>
                {
                  barConfigurations.map((item, index) => (
                  <div key={index}>
                      <h3>Levantamiento al {item.percentage}%</h3>
                      {
                        item.accuratePercentage !== item.roundPercentage ?
                        <span>Peso redondeado: {item.roundPercentage} Lb | Preciso: {item.accuratePercentage} Lb</span>:
                        <span>Peso: {item.roundPercentage} Lb</span>
                      }
                      <ul className='plates'>
                      {
                        item.plates.sort((a, b) => a - b).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      }
                        <li className="bar">———</li>
                      {
                        item.plates.sort((a, b) => b - a).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      }
                      </ul>
                  </div> 
                  ))
                }
              
              <form className='form'>
                <div className='form__field'>
                  <a className='App-link' onClick={this.restartCalculation} href="#">Reiniciar</a>
                </div>
              </form>
            </div>
        }

        {
          !saved &&
          <div className='wrapper'>
            <section className="form">
              <div className='wrapper--form'>
                <form onSubmit={this.onSubmit}>
                  <TextField
                    type="text"
                    name="PR"
                    value={PR}
                    label="PR"
                    placeholder="e.g. 320"
                    required={true}
                    error={errors.PR}
                    onChange={this.handleTextfield}
                  />

                  <Select
                    name="barWeightOptions"
                    label="Peso de barra"
                    options={barOptions}
                    onChange={this.handleSelectChange}
                  />

                  <h3>Porcentajes</h3>

                  <Percentages
                    percentages={targets}
                    onTextChange={this.handlePercentageTextfield}
                    onClick={this.handlePercentageClick} />
              
                  <div className='form__field'>
                    <Button
                      label="Calcular Total"
                      progress={false} />
                  </div>
                </form>
                
              </div>
            </section>
          </div>
        }
      </div>
    );
  }
}

export default App;