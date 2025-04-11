# Rick and Morty API

## Introduction
This project is a GraphQL API that provides access to information about characters from the Rick and Morty series. The API allows querying characters both from the public Rick and Morty API and from a local database, offering flexibility and optimized performance.

## Requirements
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)

## Project Structure
The project is organized following Clean Architecture principles and is divided into the following modules:

```
src/
├── config/           # Application configurations
├── common/           # Common utilities and middleware
├── database/         # Database configuration and connection
├── interfaces/       # TypeScript interfaces and types
├── modules/          # Application modules
│   └── characters/   # Characters module
│       ├── dto/      # Data Transfer Objects
│       ├── entities/ # Database entities
│       ├── providers/# Service providers
│       ├── repositories/ # Data repositories
│       ├── resolvers/    # GraphQL resolvers
│       └── services/     # Business logic
├── schema.gql        # GraphQL schema
└── app.module.ts     # Main application module
```

## Implemented Features
- Character querying with advanced filters
- Results pagination
- Redis data caching
- Query logging
- Data validation
- GraphQL documentation

## Optional Requirements Implemented
1. **Cron Job for Data Update**
   - Implemented in `src/modules/characters/services/characters-updater.service.ts`
   - Runs every 12 hours to keep the database updated

2. **Method Decorator for Time Measurement**
   - Implemented in `src/common/decorators/measure-time.decorator.ts`
   - Measures and logs query execution time

3. **Strategy Design Pattern**
   - Implemented in `src/modules/characters/strategies/character-data.strategy.ts`
   - Allows dynamic change of character query behavior
   - Facilitates extension for new search types

## Project Configuration

### Environment Variables
Create a `.env` file in the project root with the following variables:

```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rickandmorty

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
PORT=3000
RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api
```

### Using Docker (Recommended)
If you have Docker installed, you can start the required services with these commands. The environment variable values must match those defined in your `.env` file:

```bash
# Start PostgreSQL
docker run --name postgres-rickandmorty \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e POSTGRES_DB=${POSTGRES_DB} \
  -p ${POSTGRES_PORT}:5432 \
  -d postgres:14

# Start Redis
docker run --name redis-rickandmorty \
  -p ${REDIS_PORT}:6379 \
  -d redis:6
```

### Manual Configuration
If you prefer using local installations:

1. **PostgreSQL**
   - Install PostgreSQL 14 or higher
   - Create a database with the name specified in `POSTGRES_DB`
   - Configure user and password according to environment variables

2. **Redis**
   - Install Redis 6 or higher
   - Ensure it's running on the port specified in `REDIS_PORT`

### Service Verification
To verify that services are running correctly:

```bash
# Verify PostgreSQL
psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# Verify Redis
redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} ping
```

## Installation and Execution

1. Clone the repository:
```bash
git clone [repository-url]
cd rick-and-morty-api
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npm run migration:run
```

4. Start the application:
```bash
npm run dev
```

## Documentation and Usage

### Accessing Documentation
The API documentation is available at:
```
http://localhost:3000/graphql
```

### Import Schema in Postman
1. Open Postman
2. Create a new collection
3. Go to the "APIs" tab
4. Import the `src/schema.gql` file
5. Set the base URL to `http://localhost:3000/graphql`

### Available Queries

1. **Get Character by ID**
```graphql
query {
  character(id: 1) {
    name
    status
    species
    gender
    origin
    location
    image
  }
}
```

2. **Search Characters with Filters**
```graphql
query {
  characters(filter: {
    name: "Rick"
    status: "Alive"
    species: "Human"
  }) {
    count
    results {
      name
      status
      species
      gender
    }
  }
}
```

3. **Get Characters from Database**
```graphql
query {
  charactersFromDb(filter: {
    status: "Alive"
  }) {
    name
    status
    species
  }
}
```

## Unit Tests Status
The project has unit tests implemented for the main character service (`CharactersService`). The tests focus on the most important and critical cases of the service.

### Implemented Tests
1. **Service Definition Test**
   - Verifies that the service initializes correctly
   - Location: `src/modules/characters/services/characters.service.spec.ts`

2. **Default API Strategy Test**
   - Verifies that the service uses the API strategy by default
   - Tests character retrieval from the external API
   - Location: `src/modules/characters/services/characters.service.spec.ts`

3. **Error Handling Test**
   - Verifies behavior when both strategies (API and database) fail
   - Ensures an empty result is returned in case of error
   - Location: `src/modules/characters/services/characters.service.spec.ts`

## License
This project is licensed under the MIT License.


