# Common Package

A shared utility library containing common functions, types, models, and helpers used across the system to avoid code duplication.

## Project Structure

```
.
├── babel.config.js             # Babel configuration
├── eslint.config.mjs           # ESLint configuration
├── jest.config.ts              # Jest testing configuration
├── package.json                # Package configuration
├── src/
│   ├── helpers/                # Utility helper functions
│   │   ├── convert-number-to-ordinals.ts
│   │   ├── count-anniversary.ts
│   │   ├── generate-connection-options.ts
│   │   └── get-env.ts
│   ├── index.ts                # Main package entry point
│   ├── models/                 # Data models
│   │   ├── Model.ts           # Base model class
│   │   └── User.ts            # User model
│   ├── schemas/                # Validation schemas
│   │   └── user.schema.ts
│   ├── tests/                  # Test files
│   │   ├── helpers/
│   │   │   ├── convert-number-to-ordinals.test.ts
│   │   │   ├── count-anniversary.test.ts
│   │   │   ├── generate-connection-options.test.ts
│   │   │   └── get-env.test.ts
│   │   ├── models/
│   │   │   └── User.test.ts
│   │   └── schemas/
│   │       └── user.schema.test.ts
│   └── types/                  # TypeScript type definitions
│       ├── database.types.ts
│       ├── greeting-workflow-payload.types.ts
│       └── supabase-webhook-payload.types.ts
├── tsconfig.json               # TypeScript configuration
├── tsup.config.ts              # Build configuration
└── yarn.lock                   # Yarn dependency lock file
```

## Installation

Install this package in your project:

```bash
yarn add @your-org/common
# or
npm install @your-org/common
```

## Development

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager

### Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   yarn install
   ```

### Building

Build the package for distribution:

```bash
yarn build
```

This will compile the TypeScript code and bundle it using tsup.

### Publishing

Publish the package to npm:

```bash
npm publish
```

> **Note**: Make sure you're logged in to npm (`npm login`) and have the proper permissions before publishing.

## Testing

### Run All Tests

```bash
yarn test
```

### Run Tests with Coverage

```bash
yarn test:cov
```

### Run Tests in Watch Mode

```bash
yarn test:watch
```

## Features

### Helpers

Utility functions for common operations:

- **convert-number-to-ordinals**: Convert numbers to ordinal strings (1 → 1st, 2 → 2nd, etc.)
- **count-anniversary**: Calculate anniversary counts from dates
- **generate-connection-options**: Generate database connection configurations
- **get-env**: Safely retrieve environment variables

### Models

Reusable data models:

- **Model**: Base model class with common functionality
- **User**: User entity model

### Schemas

Validation schemas for data integrity:

- **user.schema**: User data validation schema

### Types

TypeScript type definitions:

- **database.types**: Database-related type definitions
- **greeting-workflow-payload.types**: Payload types for greeting workflows
- **supabase-webhook-payload.types**: Webhook payload types from Supabase

## Usage Example

```typescript
import { User, convertNumberToOrdinals, countAnniversary } from '@your-org/common';
import type { GreetingWorkflowPayload } from '@your-org/common';

// Use helper functions
const ordinal = convertNumberToOrdinals(3); // "3rd"
const years = countAnniversary(new Date('2020-01-01')); // Calculate years

// Use models
const user = new User({
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
});

// Use types
const payload: GreetingWorkflowPayload = {
  userId: '123',
  greetingType: 'birthday'
};
```

## Development Workflow

1. Make changes to the source code in `src/`
2. Write tests for new functionality in `src/tests/`
3. Run tests to ensure everything passes
4. Build the package with `yarn build`
5. Publish to npm with `npm publish`

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Update the version in `package.json` before publishing:

```bash
npm version patch  # or minor, or major
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Build and verify the package
6. Submit a pull request

## License

[Add your license here]
