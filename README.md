# SECWatch Platform

A modern, full-stack application for SEC filing analysis built with React and ASP.NET Core.

## 🚀 Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety and developer experience
- **TanStack Query** - Server state management and data fetching
- **React Router** - Client-side routing

### Backend
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM and data access
- **SQL Server** - Database
- **AutoMapper** - Object-object mapping
- **Swagger/OpenAPI** - API documentation

## 📁 Project Structure

### Frontend (`/Client`)
```
src/
├── features/                    # Business domain features
│   ├── auth/                   # Example feature
│   │   ├── api/               # Feature-specific API calls
│   │   ├── components/        # Internal React components
│   │   ├── hooks/            # React + TanStack Query hooks
│   │   ├── types/            # TypeScript types/interfaces
│   │   ├── views/            # Route-level React components
│   │   ├── routes.tsx        # React Router config
│   │   └── index.ts          # Public API exports
│   └── [other-features]/      # Same structure for each feature
│
├── common/                     # Common utilities and components
│   ├── components/            # Reusable React components
│   ├── hooks/                # Generic React hooks
│   ├── layouts/              # Application layouts
│   └── api/                  # API utilities
│
└── routes.tsx                 # Root React Router configuration
```

### Backend (`/API`)

TBD

## 🏗️ Architecture Principles

### Frontend Architecture
- Feature-first organization
- Type safety throughout
- Clear component boundaries
- Efficient state management with TanStack Query

### Backend Architecture
- Clean architecture principles
- Repository pattern for data access
- CQRS pattern for complex operations
- Rich domain models
- Separation of concerns

## 🔧 Development Setup

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Restore packages
dotnet restore

# Update database
dotnet ef database update

# Run the application
dotnet run
```

## 🛠️ API Documentation

The API documentation is available through Swagger UI when running the backend in development mode:
- Development: `https://localhost:5001/swagger`
- API Version: v1
- Authentication: Bearer token (JWT)

## 📋 Development Guidelines

### Frontend Guidelines
1. Follow feature-first organization
2. Maintain type safety
3. Use TanStack Query for server state
4. Keep components focused and composable

### Backend Guidelines
1. Follow SOLID principles
2. Use dependency injection
3. Keep controllers thin, logic in services
4. Use DTOs for API responses
5. Validate incoming requests
6. Handle exceptions properly

### Database Guidelines
1. Use Code-First migrations
2. Define explicit relationships
3. Include appropriate indices
4. Follow naming conventions

## 🔒 Security

- JWT-based authentication
- HTTPS-only in production
- API rate limiting
- Input validation
- XSS protection
- CORS configuration

## 🤝 Contributing

1. Follow established patterns and architecture
2. Ensure type safety throughout
3. Write clean, maintainable code
4. Document public APIs
5. Include tests for new features
6. Follow Git workflow

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core)
