import type { ThemeBrand } from './theme.types.js';

export interface BrandDefinition {
  readonly id: ThemeBrand;
  readonly label: string;
}

export const BRANDS: Readonly<BrandDefinition[]> = [
  {
    id: 'delaluz',
    label: 'De la Luz',
  },
  {
    id: 'neutral',
    label: 'Neutral',
  },
] as const satisfies readonly BrandDefinition[];
