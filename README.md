# SECWatch Platform

A modern, full-stack application for SEC filing analysis, note taking, financial metric display & exploration, and corporate oversight built with React and ASP.NET Core.

## 🚀 Tech Stack

### Frontend
- **React**
- **TypeScript**
- **TanStack Query**
- **React Router**
- **TailwindCSS**
- **shadcn/ui** 

### Backend
- **ASP.NET Core - C#**
- **Entity Framework Core**
- **MSSQL**
- **MongoDB**
- **RabbitMQ**
- **Reddis**
- **AutoMapper**
- **Swagger/OpenAPI**

### Microservices
- **Python**
- **Celery**
- **RabbitMQ**
- **Redis**
- **FastAPI**
- **MongoDB**
- **MSSQL**

## 📁 Project Structure

### Frontend (`/Client`)
```
src/
├── features/                 # Business domain features
│   ├── auth/                 # Example feature (Authentication)
│   │   ├── api/              # Feature-specific API calls
│   │   ├── ├── types.ts      # Types & interfaces pertaining to API (DTOs, requests, responses, etc.)
│   │   ├── components/       # Internal React components
│   │   ├── hooks/            # React + TanStack Query hooks
│   │   ├── views/            # Route-level React components
│   │   ├── routes.tsx        # Feature routes
│       ├── types.ts          # Types pertaining to feature.
│   │   └── index.ts          # Public API exports
│   └── [other-features]/     # Same structure for each feature
│
├── common/                   # Common utilities and components
│   ├── components/           # Reusable React components
│   ├── hooks/                # Generic React hooks
│   ├── layouts/              # Application layouts
│   └── api/                  # API utilities
│
└── routes.tsx                 # Root React Router configuration
```

### Backend (`/API`)

#### SECWatch.API

- Controllers & request-response DTOs
```
├── Features/                        # Business domain features
│   ├── Companies/                   # Example feature (Companies)
│   │   ├── DTOs/                    # DTOs for controller
│   │   └── CompaniesController.cs   # Company controller
│   │
│   └── [other-features]/
├── Common/                  # Common utilities & helpers
│
└── Program.cs               # API startup configuration
```


#### SECWatch.Application

- Services & Mapping configurations
```
├── Features/                      # Business domain features
│   ├── Companies/                 # Example feature (Companies)
│   │   ├── DTOs/                  # DTOs for service layer
│   │   ├── ICompanyService.cs     # Defines contract for CompanyService. All services should implement a contract.
        ├── CompanyService.cs      # Exposes company operations to API layer. Coordinates CRUD operations with domain & infastructure layers.                 
│   │   └── [etc.]
│   │
│   └── [other-features]/
├── Common/                   # Common utilities & helpers
│
└── DependencyInjection.cs    # Provide dependency injection extension method for consumers
```

#### SECWatch.Domain

- Models & Domain Services
```
├── Features/                                 # Business domain features
│   ├── Alerts/                               # Example feature (Alerts)
│   │   ├── Models/                           # Domain models for feature
│   │   ├── Repositories/                     # Repository contracts. To be implemented in Infrastructure layer.
│   │   ├── IAlertRuleDomainService.cs        # Defines contract for domain layer service. 
        ├── AlertRuleDomainService            # Exposes operations for creating AlertRules conforming to domain business logic rules              
│   │   └── [etc.]
│   │
│   └── [other-features]/
├── Common/                   # Common utilities & helpers
│
└── DependencyInjection.cs    # Provide dependency injection extension method for consumers
```

#### SECWatch.Infrastructure

- Repository implementations, database configurations, data access layer implementations, etc.
- 
```
├── Features/                                 # Business domain features
│   ├── Alerts/                               # Example feature (Alerts)
│   │   ├── AlertRuleRepository.cs            # Implementation of Alert Rule data access repository. 
│   │   ├── AlertRuleConfiguration.cs         # Configuration of AlertRule model in EF Core database              
│   │   └── [etc.]
│   │
│   └── [other-features]/
├── Persistence/              # Database configuration, migrations, etc.
│
└── DependencyInjection.cs    # Provide dependency injection extension method for consumers
```

### Services (`/Microservices`)

#### SECMiner

- Scrapes data from SEC and other sources
- Stores data in MongoDB database as well as MSSQL database
- Queues data into RabbitMQ for processing by API layer services.


## 🏗️ Architecture Principles

### Frontend Architecture
- Feature-first organization
- Type safety throughout
- Clear component boundaries
- Efficient state management with TanStack Query

### Backend Architecture
- Clean architecture principles
- Domain Driven Design
- Repository pattern for data access

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

## 📋 Development Guidelines

### Frontend Guidelines
1. Follow feature-first organization
3. Maintain type safety
4. Use TanStack Query for server state
5. Keep components focused and composable

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

## 🔒 Security & Integrity 

- JWT-based authentication
- API rate limiting for SECMiner

## 🤝 Contributing

1. Follow established patterns and architecture
2. Ensure type safety throughout
3. Write clean, maintainable code
4. Document contributions
5. Include tests for new features
6. Follow Git workflow
