# Task Manager SPA

A beautiful and modern task management Single Page Application (SPA) built with Next.js, React, and Tailwind CSS.

## Features

✨ **Modern UI Design**

- Clean and intuitive interface
- Responsive layout that works on all devices
- Smooth animations and transitions
- Beautiful gradient backgrounds and shadows

📝 **Task Management**

- Add new tasks with title and description
- Mark tasks as completed
- Visual feedback for completed tasks
- Pre-loaded with sample tasks

🎨 **Styling**

- Built with Tailwind CSS v4
- Custom scrollbar styling
- Hover effects and interactive elements
- Consistent color scheme and typography

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Running with Docker

Build and run the Docker container:

```bash
docker build -t task-manager-frontend .
docker run -p 3000:3000 task-manager-frontend
```

## Project Structure

```
frontend/
├── app/
│   ├── favicon.ico          # App favicon
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main task manager page (SPA)
├── public/                  # Static assets
├── Dockerfile              # Docker configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Technology Stack

- **Framework**: Next.js 16.0.0
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Build Tool**: Next.js built-in bundler

## Features Breakdown

### Add Task Form (Left Panel)

- **Title Input**: Enter a concise task title
- **Description Textarea**: Provide detailed task description
- **Add Button**: Submit the form to add a new task
- Sticky positioning for easy access while scrolling

### Task List (Right Panel)

- **Task Cards**: Display all tasks in card format
- **Task Title**: Bold, prominent task name
- **Task Description**: Supporting details for each task
- **Done Button**: Toggle task completion status
- **Visual States**:
  - Active tasks: Full opacity with white background
  - Completed tasks: Reduced opacity with strikethrough text

## Customization

### Colors

The app uses a neutral gray color scheme with blue accents. To customize colors, edit the Tailwind classes in `app/page.tsx`:

- Background: `bg-linear-to-br from-gray-50 via-gray-100 to-gray-50`
- Primary Button: `bg-blue-600 hover:bg-blue-700`
- Cards: `bg-white` with `shadow-md` and `border-gray-100`

### Layout

The layout is responsive and uses CSS Grid:

- **Desktop**: Two-column layout (4:8 ratio)
- **Mobile**: Single column, stacked layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a technical assessment.

## Author

Built as part of CoverageX interview assessment.
