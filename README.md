# Projects Hub Api

## Description

This is a backend service for a project management application developed using **Node.js**, **Express**, **TypeScript**, **MySQL**, **Objection**, **Lucia**. The service provides functionality for user registration and authentication, project and task management, data filtering, and task assignment to users.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eugeneisaykin/projects-hub-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd projects-hub-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables. Create a `.env` file and fill it in following the example of the `.env.example` file.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Project Structure

```bash
projects-hub-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── errors/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── services/
│   ├── validations/
│   └── app.ts
├── .env
├── .env.example
├── knexfile.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start the development server
- `npm run start` - Start the server
- `npm run migrate` - Applies all migrations for the database to the current state
- `npm run migrate:make -- create_table_name` - Creates a new migration with the specified name to create a table or change the database schema
- `npm run migrate:down` - Rolls back the last migration that was applied to the database
- `npm run migrate:rollback` - Rolls back the last group of migrations
- `npm run migrate:rollback:all` - Rolls back all migrations, returning the database to its original state
- `npm run seed` - Performs all efforts to fill the database with initial data
- `npm run seed:make` - Creates a new seed file that can be used to populate the database

## API Documentation

### Users:

#### 1. Registration

- POST /api/users/registration
- Request Body:
  ```
  {
      "username": "test",
      "email": "test@gmail.com",
      "firstName": "test",
      "lastName": "test",
      "password": "testtest1"
  }
  ```

#### 2. Authentication

- POST /api/users/authentication
- Request Body:

  ```
  {
      "email": "test@gmail.com",
      "password": "testtest1"
  }
  ```

#### 3. Logout

- POST /api/users/logout
- Request Body:
  ```
  {
      "logoutAllDevices": true
  }
  ```

#### 4. Get All Users

- GET /api/users
- Query Params: filtering by role

#### 5. Update User Role

- PATCH /api/users/:userId/update-role
- Request Body:
  ```
  {
      "newRole": "admin"
  }
  ```

### Roles:

#### 1. Get All Roles

- GET /api/roles

## Technologies Used

- Node.js — JavaScript runtime.
- Express — Web framework for Node.js.
- TypeScript — JavaScript superset with static typing.
- MySQL — Relational database management system (RDBMS) used to store and manage data.
- Objection — ORM (Object-Relational Mapper) for Node.js, built on top of Knex, allowing for efficient database queries with a focus on simplicity and flexibility.
- Lucia — Authentication library for managing user sessions with built-in support for various adapters and secure session handling.

## License

This project is licensed under the MIT License.
