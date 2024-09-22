import React from "react"

const ResultsPage = ({plateCounts, selectedBarbellOption, units, barConfigurations, restartCalculation}) => {

  return (
    <div className='wrapper wrapper--form'>
      <h2>Equipos necesarios</h2>
      <ul>
        <li key={-1}>Barra de {selectedBarbellOption} {units}</li>
        {
          plateCounts.map((item, index) => (
            <li key={index}>{item.quantity * 2} discos de {item.value} {units}</li>
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
                <span>
                  Peso redondeado: {item.roundPercentage} {units} | Preciso: {item.accuratePercentage} {units}
                  {item.closestConfig !== item.roundPercentage && ` | Configuración más cercana: ${item.closestConfig} ${units}`}
                </span> :
                <span>
                  Peso: {item.roundPercentage} {units}
                  {item.closestConfig !== item.roundPercentage && ` | Configuración más cercana: ${item.closestConfig} ${units}`}
                </span>
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
          <a className='App-link' onClick={restartCalculation} href="#">Reiniciar</a>
        </div>
      </form>
    </div>
  )
}

export default ResultsPage