# Gavran Poultry Management System

A full-stack poultry farm management system built with modern web technologies.

## Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Lucide React
- Axios
- Recharts
- React Hook Form
- Zod

### Backend
- Node.js + Express
- TypeScript
- MySQL 8 (mysql2 driver)
- JWT
- bcrypt
- dotenv
- cors
- helmet
- Zod
- multer

### Database
- MySQL 8 (raw SQL, prepared statements)

### Testing
- Vitest
- Supertest

## Project Structure
```
gavran-poultry-management-system/
├── client/          (React + Vite)
├── server/          (Express + TS)
├── database/        (schema.sql + migrations)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v16+
- MySQL 8+

### Setup Instructions

1. Clone the repository
2. Navigate to `server` directory and run:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and configure your database credentials
4. Start the server:
   ```bash
   npm run dev
   ```
5. In another terminal, navigate to `client` directory and run:
   ```bash
   npm install
   npm run dev
   ```

## Available Scripts

### Server
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start built application
- `npm run test`: Run tests

### Client
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build