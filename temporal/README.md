# Temporal User Greeting Service

A Temporal-based workflow application that sends automated birthday and anniversary greetings via email.

## Project Structure

```
.
├── babel.config.js             # Babel configuration
├── jest.config.ts              # Jest testing configuration
├── package.json                # Project dependencies
├── src/
│   ├── shared/                 # Shared utilities and services
│   │   ├── activities/
│   │   │   └── send_mail.ts   # Email sending activity
│   │   ├── helpers/            # Helper functions
│   │   ├── models/             # Shared data models
│   │   ├── services/
│   │   │   └── mail.service.ts # Mail service implementation
│   │   ├── tests/              # Shared tests
│   │   └── types/
│   │       └── mail.service.types.ts # Mail service types
│   └── user-greeting/          # User greeting workflows
│       ├── activities/
│       │   └── compose-greeting.ts # Greeting composition activity
│       ├── models/
│       │   ├── AnniversaryGreetingComposer.ts
│       │   ├── BirthdayGreetingComposer.ts
│       │   └── Composer.ts    # Base composer class
│       ├── tests/              # Workflow and activity tests
│       │   ├── AnniversaryGreetingComposer.test.ts
│       │   ├── BirthdayGreetingComposer.test.ts
│       │   ├── compose-greeting.test.ts
│       │   └── user-greeting.test.ts
│       ├── worker.ts           # Worker configuration
│       └── workflows/
│           └── user-greeting.ts # User greeting workflow
├── tsconfig.json               # TypeScript configuration
└── yarn.lock                   # Yarn dependency lock file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager
- Temporal CLI - [Installation Guide](https://learn.temporal.io/getting_started/typescript/hello_world_in_typescript/)
- Temporal Server (local or cloud)

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up your environment variables by creating a `.env` file:
   ```dotenv
   TEMPORAL_ADDRESS=<your temporal address>
   TEMPORAL_API_KEY=<api key for temporal namespace>
   TEMPORAL_NAMESPACE=<temporal namespace>
   MAIL_SERVICE_ENDPOINT=<hookbin or other endpoint>
   ```

### Running Temporal Server

#### Option 1: Local Development Server

Start the Temporal development server:
```bash
temporal server start-dev --ui-port 8080 --db-filename clusterdata.db
```

This will:
- Start the Temporal server locally
- Open the UI at `http://localhost:8080`
- Store data in `clusterdata.db`

#### Option 2: Temporal Cloud

If you have Temporal Cloud set up, simply configure the environment variables with your cloud credentials.

### Running the Workers

You need to run two separate workers - one for birthday greetings and one for anniversary greetings.

**Birthday Worker:**
```bash
yarn start.birthday-worker
```

**Anniversary Worker:**
```bash
yarn start.anniversary-worker
```

> **Note**: Run each worker in a separate terminal window/tab

## Environment Variables

Create a `.env` file in the project root with the following variables:

```dotenv
# Temporal Configuration
TEMPORAL_ADDRESS=<your temporal address>           # e.g., localhost:7233 or cloud address
TEMPORAL_API_KEY=<api key for temporal namespace>  # Required for Temporal Cloud
TEMPORAL_NAMESPACE=<temporal namespace>            # e.g., default or your cloud namespace

# Mail Service
MAIL_SERVICE_ENDPOINT=<hookbin or other endpoint>  # Endpoint for sending emails
```

### Example Local Configuration

```dotenv
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
MAIL_SERVICE_ENDPOINT=https://hookb.in/your-endpoint
```

## Features

### Greeting Workflows

The application manages two types of automated greetings:

- **Birthday Greetings**: Sends personalized birthday emails to users
- **Anniversary Greetings**: Sends personalized anniversary emails to users

### Architecture

- **Activities**: Reusable units of work (composing greetings, sending emails)
- **Workflows**: Orchestrate activities to send greetings at scheduled times
- **Workers**: Process workflow and activity tasks
- **Composers**: Generate personalized greeting messages

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

## Development

### Accessing Temporal UI

Once your Temporal server is running, access the UI at:
- **Local**: http://localhost:8080
- **Cloud**: Your Temporal Cloud dashboard URL

### Monitoring Workflows

Use the Temporal UI to:
- View running workflows
- Check workflow execution history
- Debug failed workflows
- Monitor worker status

## Troubleshooting

### Worker Connection Issues

If workers can't connect to Temporal:
1. Verify `TEMPORAL_ADDRESS` is correct
2. Ensure Temporal server is running
3. Check API key and namespace for cloud deployments

### Email Delivery Issues

If emails aren't being sent:
1. Verify `MAIL_SERVICE_ENDPOINT` is accessible
2. Check mail service logs
3. Review activity execution in Temporal UI

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License
