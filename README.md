# Backend API

This is a Node.js backend API built with Express, TypeScript, and Bun.

## Prerequisites

- [Bun](https://bun.sh) (v1.2.13 or later)
- Node.js (v18 or later)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.template .env
```

Then edit the `.env` file with your configuration:

- `PORT`: The port where the server will run (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `SECRET_KEY`: Secret key for JWT authentication

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build the project
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues
- `bun run format` - Format code with Prettier
- `bun run test` - Run tests
- `bun run test:coverage` - Run tests with coverage report
- `bun run type-check` - Check TypeScript types
- `bun run commit` - Create a conventional commit

## Development

The project uses several development tools:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- Husky for git hooks
- Commitlint for conventional commits

## Project Structure

```
backend/
├── src/           # Source code
├── __tests__/     # Test files
├── coverage/      # Test coverage reports
└── db.json        # Local database file
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

[Add your license here]
