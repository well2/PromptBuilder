# UI Documentation for PromptBuilder

This directory contains documentation for the UI components and design decisions in the PromptBuilder application.

## Contents

- [Menu Design](./menu-design.md) - Documentation for the navigation menu design and implementation

## UI Overview

PromptBuilder features a modern, responsive UI built with React and styled using Tailwind CSS. The interface is designed to be intuitive and user-friendly, with clear visual cues to guide users through the application.

### Key UI Components

1. **Navigation Menu** - The main navigation menu provides access to all major features of the application. See [Menu Design](./menu-design.md) for details.

2. **Category Tree** - A hierarchical tree structure for organizing prompt templates by category.

3. **Template Editor** - An interface for creating and editing prompt templates with variable placeholders.

4. **Generate Interface** - The primary function of the application, allowing users to fill in template variables and generate prompts.

5. **API Provider Configuration** - Interface for configuring OpenRouter API settings.

6. **Management Tools** - Administrative functions for importing/exporting data and managing the database.

### Design Principles

The UI follows these core design principles:

1. **Clarity** - Clear visual hierarchy and intuitive navigation
2. **Consistency** - Consistent styling and interaction patterns
3. **Feedback** - Visual feedback for user actions
4. **Accessibility** - Sufficient contrast and readable text
5. **Responsiveness** - Adapts to different screen sizes

### Color Scheme

The application uses a color scheme based on Tailwind CSS colors:

- **Primary**: Indigo (`#4f46e5`) - Used for primary actions and emphasis
- **Secondary**: Pink (`#db2777`) - Used for secondary actions
- **Accent**: Sky (`#0284c7`) - Used for highlights and accents
- **Danger**: Red (`#ef4444`) - Used for destructive actions and warnings
- **Success**: Green (`#10b981`) - Used for success states and confirmations
- **Neutral**: Gray (`#374151`) - Used for text and UI elements

### Icons

The application uses Heroicons for consistent iconography throughout the interface.

### Testing

UI components are tested using Jest and React Testing Library to ensure functionality and accessibility.
