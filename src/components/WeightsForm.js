import React from "react"
import { Switch } from "@mui/material"
import Select from "./Select"
import Percentages from "./Percentages"
import Button from "./Button"
import TextField from "./TextField"

const WeightsForm = ({ onSubmit, PR, handleUnitSwitch, handleTextfield, handlePercentageClick, handlePercentageTextfield, handleSelectChange, units, targets, barOptions, errors }) => {

  return (
    <div className='wrapper'>
      {/* Switch for KG and LB */}
      <div className="unit-switch" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label>LB</label>
        <Switch
          checked={units === "KG"}
          onChange={handleUnitSwitch}
          color="primary"
          inputProps={{ 'aria-label': 'unit switch' }}
        />
        <label>KG</label>
      </div>
      <section className="form">
        <div className='wrapper--form'>
          <form onSubmit={onSubmit}>
            <TextField
              type="text"
              name="PR"
              value={PR}
              label="PR"
              placeholder="e.g. 320"
              required={true}
              error={errors.PR}
              onChange={handleTextfield}
            />

            <Select
              name="barWeightOptions"
              label="Peso de barra"
              options={barOptions}
              onChange={handleSelectChange}
            />

            <h3>Porcentajes</h3>

            <Percentages
              percentages={targets}
              onTextChange={handlePercentageTextfield}
              onClick={handlePercentageClick}
              errors={errors}
            />

            <div className='form__field'>
              <Button
                type="submit"
                label="Calcular"
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default WeightsForm