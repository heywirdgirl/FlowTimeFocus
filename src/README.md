# FlowTime Focus

This is a time management application built with Next.js and Firebase Studio, helping you to focus on your work and rest effectively.

## Directory Structure

```
.
├── .env                  # File containing environment variables
├── src
│   ├── ai                # AI-related files with Genkit
│   │   ├── flows         # Main AI logic
│   │   └── genkit.ts     # Genkit configuration
│   ├── app               # Main Next.js routes and layouts
│   │   ├── create        # Page for creating a new cycle
│   │   ├── globals.css   # Global CSS
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components        # React components
│   │   ├── app           # Application-specific components
│   │   └── ui            # UI components from ShadCN
│   ├── contexts          # React context providers
│   ├── hooks             # Custom React hooks
│   └── lib               # Utility functions, types, and shared files
├── package.json          # List of dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Installed Libraries

Below is a list of the main libraries used in the project:

- **Next.js**: React framework for building web applications.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: JavaScript-based programming language with static types.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **ShadCN/UI**: Collection of reusable user interface components.
- **Genkit**: Toolkit for building AI features.
- **Lucide React**: Icon library.
- **Zod**: Schema validation library.
- **Framer Motion**: Animation library for React.
- **React Hook Form**: Form management library.
- **Howler.js**: Audio library for the modern web.

## Environment Variables

To run the application, you need to create a `.env` file in the root directory of the project and fill in the following variables. Currently, no environment variables are required.

```bash
# No environment variables are required at this time.
```

## Getting Started

To get started, take a look at `src/app/page.tsx`.
