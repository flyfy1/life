# Life 

A diary/note synchronization application built with React and TypeScript, supporting both online and offline usage.

## Setup

```bash
# install packages
pnpm install

# start local server
pnpm start

# deploy to gh-pages
pnpm run deploy
```

## Key Features

- User authentication
- Online note synchronization
- Offline storage support
- Markdown content rendering
- Note filtering by date range
- Sorting by creation/modification time
- Responsive interface design

## Tech Stack

- React 18
- TypeScript 4
- IndexedDB (via idb library)
- React Markdown
- CSS3

## Development Requirements

- Node.js >= 16
- npm >= 8

## Installation and Running

1. Clone the project and install dependencies:

```bash
git clone [project-url]
cd [project-directory]
pnpm install
```

2. Start the development server:

```bash
pnpm start
```

The application will run at http://localhost:3000

## Project Structure

```
src/
  ├── components/      # React components
  ├── services/        # API and database services
  ├── styles/          # CSS style files
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  └── App.tsx         # Application entry component
```

## Feature Details

### Authentication
- Username and password login
- JWT token authentication
- Persistent login state

### Note Synchronization
- Automatic periodic sync (every 5 minutes)
- Manual sync trigger support
- Offline-first strategy

### Data Storage
- Local storage using IndexedDB
- Offline access and editing support
- Sync conflict resolution

### Interface Features
- Date range note filtering
- Sorting by creation/modification time
- Real-time Markdown rendering
- Responsive design for mobile compatibility

## API Configuration

Default API address is `http://localhost:8080`, configurable in `src/services/api.ts` by modifying `API_BASE`.

## Build and Deployment

Execute the following command to build for production:

```bash
npm run build
```

Built files will be generated in the `build` directory, ready for deployment to a static server.

## Development

### Available Commands

```bash
pnpm start      # Start development server
pnpm test      # Run tests
pnpm run build  # Build for production
pnpm run eject  # Eject configuration files
```

### Code Standards

The project uses TypeScript strict mode to ensure type safety.

## License

This project is licensed under the MIT License.
