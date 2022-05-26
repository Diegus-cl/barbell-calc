import React, { Component } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PR: "",
      barbellWeight: "",
      tempTarget: "",
      discSet: [45, 35, 25, 15, 10, 5, 2.5],
      targets: [],
      barConfigurations: [],
      finalPlateSet: [],
      plateCounts: [],
      errors: {},
      saving: false,
      saved: false
    }
  }

  handleTextfield = e => {
    const field = e.target.name;
    let newState = this.state;
    newState[field] = e.target.value;
    this.setState(newState);
    //this.setState({team: Object.assign({}, team)});
  }

  onSubmit = e => {
    e.preventDefault();

    const newState = {
      ...this.state
     };

    newState.discSet.sort((a, b) => b - a);
    newState.targets.sort((a, b) => a - b);
    //temp
    newState.targets[0] = parseInt(this.state.tempTarget);
    //end temp
    console.log(newState);
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
      barbellWeight,
      tempTarget
     } = this.state;
    const { plateCounts, barConfigurations, errors, saving, saved } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          CFM Barbell Calc
        </header>

        {
          saved &&
            <div className='wrapper'>
              Resultados
              <div>
                finalPlateSet
                {
                  plateCounts.map((item, index) => (
                  <div>{index} lb: {item * 2}</div> 
                  ))
                }
              </div>
              
              <div>
                barConfigurations
                  {
                    barConfigurations.map((item, index) => (
                    <div>
                        <div>percentage: {item.percentage}%</div> 
                        <div>accurate: {item.accuratePercentage}</div> 
                        <div>round: {item.roundPercentage}</div> 
                        <div>plates: {
                          item.plates.map((i) => (
                            <div>{i} x 2</div>
                          ))
                        }</div> 
                    </div> 
                    ))
                  }
                </div>
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

                  <TextField
                    type="text"
                    name="tempTarget"
                    value={tempTarget}
                    label="Porcentaje"
                    placeholder="e.g. 80%"
                    required={true}
                    error={errors.tempTarget}
                    onChange={this.handleTextfield}
                  />

                  <Button
                    label="Agregar Porcentaje"
                    progress={false} />
              
                  <Button
                    label="Calcular"
                    progress={false} />
                </form>
                
              </div>
            </section>
          </div>
        }

        {/* <div>
          finalPlateSet
          {
            plateCounts.map((item, index) => (
             <div>{index} lb: {item * 2}</div> 
            ))
          }
        </div>

        <div>
        barConfigurations
          {
            barConfigurations.map((item, index) => (
             <div>
                <div>percentage: {item.percentage}%</div> 
                <div>accurate: {item.accuratePercentage}</div> 
                <div>round: {item.roundPercentage}</div> 
                <div>plates: {
                  item.plates.map((i) => (
                    <div>{i} x 2</div>
                  ))
                }</div> 
             </div> 
            ))
          }
        </div> */}
    
      </div>
    );
  }
}

export default App;