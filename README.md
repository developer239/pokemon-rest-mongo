# Pokemon API

![master](https://github.com/developer239/pokemon-rest-mongo/actions/workflows/api-ci.yml/badge.svg)

![preview](./preview.png)

## Table of Contents

- [Setup](#setup)
- [Development](#development)
- [Database](#database)
- [Testing](#testing)

## Run with Docker

```bash
docker-compose up
```

**Note:** By default it uses `.env.template`.

## Setup

1. Install dependencies: `make install` (the project uses [yarn](https://github.com/yarnpkg))
2. Create local environment file: `cp .env.template .env`
3. Run infrastructure `make infra`
4. Run development server: `make develop`

## Development

- `make infra` - start postgres docker container
- `make develop` - start development server
- `make type-check` - run type checking
- `make lint-fix` - run linter
- `make format` - run prettier

## Database

- `make seed-database` - truncate all tables and seed database with initial data

```mermaid
classDiagram
  class User {
    string _id
    string email
    string password (hidden)
    ObjectId[] favoritePokemons (references Pokemon)
  }
  class Pokemon {
    string _id
    number number
    string name
    string classification
    string[] types
    string[] resistant
    string[] weaknesses
    object weightRange
    object heightRange
    number fleeRate
    number maxCP
    number maxHP
    ObjectId[] favoritedBy (references User)
    Attack[] attacks
    EvolutionRequirement evolutionRequirements
    Evolution[] evolutions
  }
  class Attack {
    string name
    string type
    AttackCategory category
    number damage
  }
  class EvolutionRequirement {
    number amount
    string name
  }
  class Evolution {
    string name
    number number
  }

  User "1" *-- "*" Pokemon : favoritePokemons
  Pokemon "1" *-- "*" Attack : attacks
  Pokemon "1" *-- "1" EvolutionRequirement : evolutionRequirements
  Pokemon "1" *-- "1" Evolution : evolutions
  Pokemon "1" *-- "*" User : favoritedBy
```

## Testing

Most of the tests are E2E tests and require connection to the database.

- `make test` - run all tests
- `make coverage` - run test coverage
