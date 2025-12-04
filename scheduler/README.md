# NestJS Webhook Handler

A NestJS application that handles user events via webhooks, managing greeting schedules for birthdays and anniversaries.

## Project Structure

```
.
├── babel.config.js             # Babel configuration
├── eslint.config.mjs           # ESLint configuration
├── jest.config.ts              # Jest testing configuration
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # Project dependencies
├── src/
│   ├── app.controller.spec.ts  # App controller tests
│   ├── app.controller.ts       # Main application controller
│   ├── app.module.ts           # Root application module
│   ├── app.service.ts          # Main application service
│   ├── handle-user-event/      # User event handler module
│   │   ├── handler.ts          # Event handler logic
│   │   └── models/             # Data models
│   │       ├── Schedule.ts
│   │       ├── UserAnniversaryGreetingSchedule.ts
│   │       ├── UserBirthdayGreetingSchedule.ts
│   │       └── UserGreetingSchedule.ts
│   └── main.ts                 # Application entry point
├── test/                       # Test files
│   ├── app.e2e-spec.ts        # End-to-end tests
│   ├── handle_user_event/      # Handler tests
│   │   ├── handler.test.ts
│   │   └── models/
│   │       ├── UserAnniversaryGreetingSchedule.test.ts
│   │       └── UserBirthdayGreetingSchedule.test.ts
│   └── jest-e2e.json          # E2E test configuration
├── tsconfig.build.json         # TypeScript build configuration
├── tsconfig.json               # TypeScript configuration
└── yarn.lock                   # Yarn dependency lock file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager
- Supabase project (for webhook integration)

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Application

1. Start the NestJS server:
   ```bash
   yarn start
   ```

2. In a separate terminal, start the tunnel to expose your local server:
   ```bash
   yarn tunnel
   ```

3. Copy the tunnel URL from the output - you'll need this for the Supabase webhook configuration

### Supabase Webhook Configuration

1. Go to your Supabase project dashboard
2. Navigate to Database → Webhooks
3. Create a new webhook
4. Use the tunnel URL from `yarn tunnel` as the webhook endpoint
5. Configure the webhook to trigger on user-related database events

## Features

### User Event Handler

The application processes user events and manages greeting schedules:

- **Birthday Greetings**: Automatically schedules birthday greetings for users
- **Anniversary Greetings**: Manages anniversary greeting schedules
- **Custom Schedules**: Supports flexible scheduling for user greetings

### Models

- `Schedule`: Base schedule model
- `UserGreetingSchedule`: Generic user greeting schedule
- `UserBirthdayGreetingSchedule`: Birthday-specific greeting schedule
- `UserAnniversaryGreetingSchedule`: Anniversary-specific greeting schedule

## Testing

### Run Unit Tests

```bash
yarn test
```

### Run E2E Tests

```bash
yarn test:e2e
```

### Run Tests with Coverage

```bash
yarn test:cov
```

## Development

### Running in Development Mode

```bash
yarn start:dev
```

### Running in Debug Mode

```bash
yarn start:debug
```

### Linting

```bash
yarn lint
```

### Building for Production

```bash
yarn build
```

## Project Configuration

- **TypeScript**: Configured via `tsconfig.json` and `tsconfig.build.json`
- **ESLint**: Code linting rules in `eslint.config.mjs`
- **Jest**: Testing framework configured in `jest.config.ts`
- **Babel**: Transpilation configured in `babel.config.js`

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

