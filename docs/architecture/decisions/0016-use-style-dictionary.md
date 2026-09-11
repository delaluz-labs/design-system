# ADR-0016: Use Style Dictionary for token transformations

## Status

Accepted

## Context

The design system requires platform-specific artifacts from a
platform-neutral token source.

## Decision

Style Dictionary will be used as the initial transformation engine.

Custom transforms will be implemented when platform-specific
requirements cannot be covered correctly by built-in transforms.

The DTCG source format remains independent from Style Dictionary.

## Consequences

Style Dictionary can be replaced in the future without changing
the canonical design token definitions.
