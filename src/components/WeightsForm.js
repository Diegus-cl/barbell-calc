import React, { useState } from "react"
import { Switch } from "@mui/material"
import Select from "./Select"
import Percentages from "./Percentages"
import Button from "./Button"
import TextField from "./TextField"

const WeightsForm = ({ onSubmit, PR, handleUnitSwitch, handleTextfield, handlePercentageClick, handlePercentageTextfield, handleSelectChange, units, targets, isPercentagesCalculation, setIsPercentageCalculation, barOptions, errors }) => {
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
          <form>
            {/* <p>Elige el modo:</p> */}
            <h2 style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={"select-mode " + (isPercentagesCalculation ? "active" : "")} onClick={() => setIsPercentageCalculation(true)}>Porcentajes</span>
              <span className={"select-mode " + (isPercentagesCalculation ? "" : "active")} onClick={() => setIsPercentageCalculation(false)}>Pesos Manuales</span>
            </h2>

            {
              isPercentagesCalculation &&
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
            }

            <Select
              name="barWeightOptions"
              label="Peso de barra"
              options={barOptions}
              onChange={handleSelectChange}
            />

            {/* {
              isPercentagesCalculation 
              ?
              <Percentages
                percentages={targets}
                onTextChange={handlePercentageTextfield}
                onClick={handlePercentageClick}
                errors={errors}
              />
              :
              <h1>Formulario de pesos manuales coming soon</h1>
            } */}

            <Percentages
              percentages={targets}
              onTextChange={handlePercentageTextfield}
              onClick={handlePercentageClick}
              errors={errors}
              isPercentagesCalculation={isPercentagesCalculation}
            />

            {/* This one will calculate in the current unit */}
            <div className='form__field'>
              <Button
                type="submit"
                label={`Calcular en ${units === "KG" ? "kilos" : "libras"}`}
                onClick={(e) => onSubmit(e, units === "LB" ? "LB" : "KG")}
              />
            </div>

            {/* and this one in the opposite unit */}
            <div className='form__field'>
              <Button
                type="submit"
                label={`Calcular en ${units === "LB" ? "kilos" : "libras"}`} 
                onClick={(e) => onSubmit(e, units === "LB" ? "KG" : "LB")}
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default WeightsForm