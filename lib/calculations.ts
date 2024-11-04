interface PlateConfiguration {
  percentage?: number
  accurateWeight: number
  roundedWeight: number
  closestWeight: number
  plates: number[]
}

interface CalculationParams {
  PR?: number
  barWeight: number
  values: number[]
  units: "KG" | "LB"
  isPercentages: boolean
  sourceUnits: "KG" | "LB"
}

const AVAILABLE_PLATES = {
  KG: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5],
  LB: [45, 35, 25, 10, 5, 2.5],
}

const CONVERSION_RATES = {
  KG_TO_LB: 2.20462,
  LB_TO_KG: 0.453592
}

export function calculatePlateConfigurations({
  PR,
  barWeight,
  values,
  units,
  sourceUnits,
  isPercentages,
}: CalculationParams): PlateConfiguration[] {
  const plates = AVAILABLE_PLATES[units]

  const shouldConvert = sourceUnits !== units
  const conversionRate = shouldConvert
    ? (sourceUnits === "KG" ? CONVERSION_RATES.KG_TO_LB : CONVERSION_RATES.LB_TO_KG)
    : 1

  const convertedPR = PR ? PR * conversionRate : undefined
  const convertedBarWeight = barWeight * conversionRate
  const convertedValues = isPercentages 
    ? values 
    : values.map(v => v * conversionRate)

  return convertedValues.map(value => {
    let targetWeight: number

    if (isPercentages) {
      if (!convertedPR) throw new Error("PR is required for percentage calculations")
      targetWeight = convertedPR * (value / 100)
    } else {
      targetWeight = value
    }

    const weightPerSide = (targetWeight - convertedBarWeight) / 2
    const plateConfiguration = calculatePlates(weightPerSide, plates)
    const actualTotalWeight = plateConfiguration.totalWeight * 2 + convertedBarWeight

    return {
      percentage: isPercentages ? value : undefined,
      accurateWeight: targetWeight,
      roundedWeight: Math.round(targetWeight),
      closestWeight: actualTotalWeight,
      plates: plateConfiguration.plates,
    }
  })
}

function calculatePlates(targetWeight: number, availablePlates: number[]) {
  const plates: number[] = []
  let remainingWeight = targetWeight

  const sortedPlates = [...availablePlates].sort((a, b) => b - a)

  for (const plate of sortedPlates) {
    while (remainingWeight >= plate) {
      plates.push(plate)
      remainingWeight -= plate
    }
  }

  return {
    plates,
    totalWeight: plates.reduce((sum, plate) => sum + plate, 0),
  }
}