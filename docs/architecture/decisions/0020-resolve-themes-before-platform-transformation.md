# ADR-0020: Resolve themes before platform transformation

## Status

Accepted

## Context

Theme token sources intentionally override values according to
brand, scheme and accessibility contexts.

Loading all token sources directly into Style Dictionary causes
token collisions and does not represent the semantics defined by
the DTCG Resolver Module.

## Decision

Theme composition must occur before platform transformation.

The pipeline is:

DTCG Sources
→ Resolver
→ Resolved Token Tree
→ Style Dictionary
→ Platform Artifacts

Style Dictionary is responsible for platform transformations,
reference resolution and formatting.

The theme resolver is responsible for input validation,
resolution order and conflict resolution.

## Consequences

Intentional theme overrides do not generate Style Dictionary
collisions.

The DTCG Resolver remains the source of truth for theme
composition.

Platform generation remains independent from theme composition.
