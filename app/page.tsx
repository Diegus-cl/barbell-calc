import { TypographyH1 } from "@/components/ui/typography-h1"
import { WeightCalculatorForm } from "./components/weight-calculator-form"

export default function Home() {
  return (
    <main className="pt-14 container mx-auto p-4 flex flex-col items-center gap-12">
      <TypographyH1>Calculadora de pesos</TypographyH1>
      <WeightCalculatorForm />
    </main>
  )
}
