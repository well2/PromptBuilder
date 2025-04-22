# PromptBuilder Frontend

This is the frontend for the PromptBuilder application, built with React, TypeScript, and Tailwind CSS.

## Project Structure

The frontend follows a component-based architecture with the following structure:

- **src/components**: Reusable UI components
  - **ui**: Basic UI components (Button, Input, Select, etc.)
  - **layout**: Layout components (Header, Footer, etc.)
  - **templates**: Template-related components
  - **categories**: Category-related components
  - **generate**: Prompt generation components
- **src/hooks**: Custom React hooks for data fetching and state management
- **src/pages**: Page components
- **src/services**: API services
- **src/types**: TypeScript type definitions
- **src/utils**: Utility functions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create a `.env` file with the following content:

```
VITE_API_BASE_URL=http://localhost:5062/api
```

Note: When building for production with Docker, this is set to `/` since the API is served from the same origin.

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Features

- **Categories Management**: Create, edit, and delete categories in a hierarchical structure
- **Templates Management**: Create, edit, and delete prompt templates with variables
- **Prompt Generation**: Select a category, fill in template variables, and get responses from LLMs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License.
