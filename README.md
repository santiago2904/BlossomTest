# Rick and Morty API

## Introducción
Este proyecto es una API GraphQL que proporciona acceso a información sobre personajes de la serie Rick and Morty. La API permite consultar personajes tanto desde la API pública de Rick and Morty como desde una base de datos local, ofreciendo flexibilidad y rendimiento optimizado.

## Requisitos
- Node.js (v14 o superior)
- npm o yarn
- Redis (para caché)
- PostgreSQL

## Estructura del Proyecto
El proyecto está organizado siguiendo los principios de Clean Architecture y está dividido en los siguientes módulos:

```
src/
├── config/           # Configuraciones de la aplicación
├── common/           # Utilidades y middleware comunes
├── database/         # Configuración y conexión a la base de datos
├── interfaces/       # Interfaces y tipos TypeScript
├── modules/          # Módulos de la aplicación
│   └── characters/   # Módulo de personajes
│       ├── dto/      # Data Transfer Objects
│       ├── entities/ # Entidades de la base de datos
│       ├── providers/# Proveedores de servicios
│       ├── repositories/ # Repositorios de datos
│       ├── resolvers/    # Resolvers de GraphQL
│       └── services/     # Lógica de negocio
├── schema.gql        # Esquema GraphQL
└── app.module.ts     # Módulo principal de la aplicación
```

## Características Implementadas
- Consulta de personajes con filtros avanzados
- Paginación de resultados
- Caché de datos en Redis
- Logging de consultas
- Validación de datos
- Documentación GraphQL

## Requisitos Opcionales Implementados
1. **Cron Job para Actualización de Datos**
   - Implementado en `src/modules/characters/services/characters-updater.service.ts`
   - Se ejecuta cada 12 horas para mantener la base de datos actualizada

2. **Decorador de Métodos para Medición de Tiempo**
   - Implementado en `src/common/decorators/measure-time.decorator.ts`
   - Mide y registra el tiempo de ejecución de las consultas

3. **Patrón de Diseño Strategy**
   - Implementado en `src/modules/characters/strategies/character-data.strategy.ts`
   - Permite cambiar dinámicamente el comportamiento de las consultas de personajes
   - Facilita la extensión para nuevos tipos de búsqueda

## Cómo Iniciar el Proyecto

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd rick-and-morty-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Ejemplo de archivo .env:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=rick_and_morty_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
PORT=3000
NODE_ENV=development

# Rick and Morty API
RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api
```

4. Ejecutar migraciones de la base de datos:
```bash
npm run migration:run
```

5. Iniciar la aplicación:
```bash
npm run start:dev
```

## Documentación y Uso

### Acceso a la Documentación
La documentación de la API está disponible en:
```
http://localhost:3000/graphql
```

### Importar Schema en Postman
1. Abre Postman
2. Crea una nueva colección
3. Ve a la pestaña "APIs"
4. Importa el archivo `src/schema.gql`
5. Configura la URL base como `http://localhost:3000/graphql`

### Queries Disponibles

1. **Obtener un Personaje por ID**
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

2. **Buscar Personajes con Filtros**
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

3. **Obtener Personajes desde la Base de Datos**
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


## URL de Producción
La API está desplegada en:
```
https://rick-and-morty-api.example.com/graphql
```


## Licencia
Este proyecto está bajo la licencia MIT.

## Estado de las Pruebas Unitarias
El proyecto tiene pruebas unitarias implementadas para el servicio principal de personajes (`CharactersService`). Las pruebas se centran en los casos más importantes y críticos del servicio.

### Pruebas Implementadas
1. **Prueba de Definición del Servicio**
   - Verifica que el servicio se inicialice correctamente
   - Ubicación: `src/modules/characters/services/characters.service.spec.ts`

2. **Prueba de Estrategia de API por Defecto**
   - Verifica que el servicio use la estrategia de API por defecto
   - Prueba la obtención de personajes desde la API externa
   - Ubicación: `src/modules/characters/services/characters.service.spec.ts`

3. **Prueba de Manejo de Errores**
   - Verifica el comportamiento cuando ambas estrategias (API y base de datos) fallan
   - Asegura que se devuelva un resultado vacío en caso de error
   - Ubicación: `src/modules/characters/services/characters.service.spec.ts`


