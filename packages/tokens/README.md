# @delaluz/tokens

Platform-agnostic design tokens for the De la Luz Labs Design System.

## Architecture

Tokens are organized into three layers:

Primitive → Semantic → Component

## Source format

The canonical source uses the Design Tokens Community Group
2025.10 format.

## Generated outputs

The package generates:

- CSS custom properties
- JavaScript/TypeScript consumable tokens
- Normalized JSON

Additional platform adapters will be introduced for React Native
and other runtimes.

## Development

Install dependencies:

```bash
npm ci
