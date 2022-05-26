import React, { Component } from 'react';
import Button from './components/Button';
import './App.css';

class App extends Component {
  render() {
    let barbellWeight = 45;
    let discSet = [45, 35, 25, 15, 10, 5, 2.5];
    discSet.sort((a, b) => b - a);

    const pr = 280;
    let targets = [100, 90, 80, 70, 64, 63, 25];
    targets.sort((a, b) => a - b);

    const targetWeights = [];
    let barConfigurations = [];
    let plateCounts = [];

    targets.forEach((targetPercentage, index) => {
      let tW = Math.round(pr * targetPercentage/100);
      targetWeights.push(tW - tW % 5) // delete `% 5` for 100% accuracy
      barConfigurations[index] = { 
        percentage: targetPercentage,
        accuratePercentage: tW,
        roundPercentage: targetWeights[index],
        plates: []
      };
    });

    let finalPlateSet = []; // all plates to carry at once
    let finalPlatesTemp = [];

    targetWeights.forEach((tW, index) => {
      finalPlatesTemp = [...finalPlateSet];
      let targetWeight = (tW - barbellWeight) / 2;

      discSet.forEach((plate) => {
        while (targetWeight >= plate) {
          targetWeight -= plate;
          barConfigurations[index].plates.push(plate);

          const foundPlateIndex = finalPlatesTemp.indexOf(plate);
          if (foundPlateIndex > -1) {
            finalPlatesTemp.splice(foundPlateIndex, 1);
          } else {
            finalPlateSet.push(plate);
          }
        }
      });
    });

    finalPlateSet.forEach((x) => {
      plateCounts[x] = (plateCounts[x] || 0) + 1;
    });

    return (
      <div className="App">
        <header className="App-header">
          Barbell Calculator
        </header>

        <div className='wrapper'>
          <div className='wrapper--form'>
            <Button
              label="Calcular"
              progress={false} />
          </div>
        </div>


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
    );
  }
}

export default App;