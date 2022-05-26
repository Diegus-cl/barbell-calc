import React, { Component } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import Percentages from './components/Percentages';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.setDefaultState();
  }

  setDefaultState() {
    return {
      PR: "",
      barbellWeight: "",
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

  handlePercentageTextfield = e => {
    const percentageIndex = Number(e.target.name.substr(e.target.name.indexOf('_') + 1));
    const field = e.target.name.slice(0, e.target.name.indexOf('_'));
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
      let targetWeight = (tW - parseInt(newState.barbellWeight)) / 2;

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

    newState.finalPlateSet.forEach((x) => {
      newState.plateCounts[x] = (newState.plateCounts[x] || 0) + 1;
    });

    newState.saved = true;
    this.setState(newState);
  }

  render() {
    const {
      PR,
      barbellWeight
     } = this.state;
    const { targets, plateCounts, barConfigurations, errors, saving, saved } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          CFM Calculadora
        </header>

        {
          saved &&
            <div className='wrapper'>
              <h2>Equipos necesarios</h2>
              <ul>
                <li key={-1}>Barra de {barbellWeight} Lb</li>
                {
                  plateCounts.map((item, index) => (
                    <li key={index}>{item * 2} discos de {index} Lb</li> 
                  ))
                }
              </ul>
              <h2>Configuración de porcentajes</h2>
                {
                  barConfigurations.map((item, index) => (
                  <div key={index}>
                      <h3>Levantamiento al {item.percentage}%</h3>
                      {
                        item.accuratePercentage != item.roundPercentage ?
                        <span>Peso redondeado: {item.roundPercentage} Lb | Real: {item.accuratePercentage} Lb</span>:
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
                  <a className='App-link' onClick={this.restartCalculation} href="#">Nuevo Calculo</a>
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

                  <TextField
                    type="text"
                    name="barbellWeight"
                    value={barbellWeight}
                    label="Peso de barbell"
                    placeholder="e.g. 45"
                    required={true}
                    error={errors.barbellWeight}
                    onChange={this.handleTextfield}
                  />

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