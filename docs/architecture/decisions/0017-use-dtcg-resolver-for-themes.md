# ADR-0017: Use DTCG Resolver for theme composition

## Status

Accepted

## Context

The design system requires multiple brands, color schemes and
accessibility preferences without duplicating token definitions.

## Decision

Theme composition will follow the DTCG 2025.10 Resolver Module.

Theme dimensions will initially include:

- brand
- scheme
- contrast
- motion

Modifiers should remain as orthogonal as practical.

## Consequences

Theme permutations can be validated systematically.

Platform-specific output formats remain independent from theme
composition.

Adding new theme dimensions increases the number of possible
permutations and must therefore be reviewed carefully.
