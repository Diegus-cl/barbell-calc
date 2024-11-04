"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TypographyH3 } from "@/components/ui/typogrpahy-h3"
import { useRouter } from "next/navigation"

const createFormSchema = (isPercentagesCalculation: boolean) => {
  return z.object({
    PR: isPercentagesCalculation
      ? z.string().min(1, { message: "PR is required" })
      : z.string().optional(),
    barWeight: z.string().min(1, { message: "Bar weight is required" }),
    percentages: z.array(z.string()),
  })
}

export function WeightCalculatorForm() {
  const router = useRouter()
  const [units, setUnits] = useState<"KG" | "LB">("KG")
  const [isPercentagesCalculation, setIsPercentagesCalculation] = useState(true)
  const [percentageCount, setPercentageCount] = useState(1)

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema(isPercentagesCalculation)),
    defaultValues: {
      PR: "",
      barWeight: "",
      percentages: [""],
    },
  })

  function onSubmit(alternateUnit: boolean = false) {
    return (values: z.infer<ReturnType<typeof createFormSchema>>) => {
      const searchParams = new URLSearchParams()
      const targetUnits = alternateUnit ? (units === "KG" ? "LB" : "KG") : units

      // Convert string values to numbers before sending
      const numericValues = values.percentages
        .filter(val => val !== "") // Filter out empty values
        .map(val => parseFloat(val))

      searchParams.set('units', targetUnits)
      searchParams.set('barWeight', values.barWeight)
      searchParams.set('isPercentages', isPercentagesCalculation.toString())
      searchParams.set('sourceUnits', units) // Add source units for proper conversion

      if (isPercentagesCalculation && values.PR) {
        searchParams.set('PR', values.PR)
      }

      numericValues.forEach((value, index) => {
        searchParams.set(`value${index}`, value.toString())
      })

      router.push(`/results?${searchParams.toString()}`)
    }
  }

  const addPercentage = () => {
    setPercentageCount(prev => prev + 1)
    const currentPercentages = form.getValues().percentages
    form.setValue('percentages', [...currentPercentages, ""])
  }

  const barOptions = [
    { value: "20", label: "20kg/45lb" },
    { value: "15", label: "15kg/35lb" },
    { value: "10", label: "10kg/25lb" },
  ]

  const handleCalculationTypeChange = (value: string) => {
    const isPercentages = value === "percentages"
    setIsPercentagesCalculation(isPercentages)
    form.reset(form.getValues())
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="KG" onValueChange={(value) => setUnits(value as "KG" | "LB")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="KG">KG</TabsTrigger>
          <TabsTrigger value="LB">LB</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs
        defaultValue="percentages"
        onValueChange={handleCalculationTypeChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="percentages">Porcentajes</TabsTrigger>
          <TabsTrigger value="weights">Pesos Manuales</TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit(false))} className="space-y-8">
          {isPercentagesCalculation && (
            <FormField
              control={form.control}
              name="PR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <TypographyH3>PR</TypographyH3>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 320" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="barWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <TypographyH3>Peso de barra</TypographyH3>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el peso de la barra" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {barOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Percentage inputs */}
          {Array.from({ length: percentageCount }).map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`percentages.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isPercentagesCalculation ? "Porcentaje" : "Peso"} {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isPercentagesCalculation ? "e.g. 85" : "e.g. 100"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPercentage}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar {isPercentagesCalculation ? "porcentaje" : "peso"}
          </Button>

          <div className="space-y-4">
            <Button
              type="button"
              className="w-full"
              onClick={form.handleSubmit(onSubmit(false))}
            >
              Calcular en {units}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={form.handleSubmit(onSubmit(true))}
            >
              Calcular en {units === "KG" ? "LB" : "KG"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 