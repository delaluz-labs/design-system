# ADR-0015: Use layered design tokens

## Status

Accepted

## Context

Directly consuming primitive values from UI components creates
coupling between visual implementation details and component intent.

## Decision

Design tokens will be organized into three primary layers:

1. Primitive tokens
2. Semantic tokens
3. Component tokens

Semantic tokens may reference primitive tokens.

Component tokens should primarily reference semantic tokens.

## Consequences

Themes can change primitive mappings without requiring changes
to component implementations.

Component intent remains stable even when the visual language evolves.
