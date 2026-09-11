# ADR-0007: Adopt DTCG 2025.10 as design token format

## Status

Accepted

## Context

De la Luz Labs requires design tokens that can be consumed by web,
hybrid mobile, native mobile and desktop applications.

A proprietary token format would increase coupling with the internal
toolchain and reduce interoperability with design tools.

## Decision

The design system will use the Design Tokens Community Group
2025.10 format as the canonical representation of design tokens.

Design tokens will be stored as JSON and use the DTCG properties
such as `$value`, `$type` and `$description`.

Platform-specific representations will be generated from these
canonical files.

## Consequences

Positive:

- Platform-independent source of truth.
- Improved interoperability.
- Easier integration with design tools.
- Explicit token types.
- Future platform adapters can share the same source.

Trade-offs:

- Some platform targets require custom transformations.
- Not every DTCG type has a lossless representation on every platform.
- Tooling must evolve with future versions of the specification.
