import { TypographyH1 } from "@/components/ui/typography-h1";
import { calculatePlateConfigurations } from "@/lib/calculations";
import { PlateConfigurations } from "./components/plate-configurations";

interface SearchParams {
  units: string;
  sourceUnits: string;
  barWeight: string;
  isPercentages: string;
  PR?: string;
  [key: string]: string | undefined;
}

interface PageProps {
  searchParams: SearchParams;
}

export default function Results({
  searchParams,
}: PageProps) {
  const units = searchParams.units as "KG" | "LB";
  const sourceUnits = searchParams.sourceUnits as "KG" | "LB";
  const barWeight = parseFloat(searchParams.barWeight);
  const isPercentages = searchParams.isPercentages === "true";
  const PR = searchParams.PR ? parseFloat(searchParams.PR) : undefined;

  const values = Object.entries(searchParams)
    .filter(([key]) => key.startsWith('value'))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_key, value]) => parseFloat(value ?? '0'));

  const configurations = calculatePlateConfigurations({
    PR,
    barWeight,
    values,
    units,
    sourceUnits,
    isPercentages,
  });

  return (
    <main className="container mx-auto p-4">
      <TypographyH1>Resultados</TypographyH1>
      <PlateConfigurations 
        configurations={configurations}
        units={units}
        sourceUnits={sourceUnits}
        PR={PR}
        isPercentages={isPercentages}
      />
    </main>
  );
}
