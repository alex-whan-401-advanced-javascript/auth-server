# Auth-Server

## Project: Authentication Server (Labs 11-14)

An authentication system utilizing an Express server and Node environment, developed in four phases.

The server uses a custom “authentication” module designed to handle user registration and sign in using Basic, Bearer, or OAuth along with a custom “authorization” module that will grant/deny users access to the server based on their role or permissions level.

### Author:

- Alex Whan

### Links and Resources

### Setup

### Technology

- Express
- bcrypt
- CORS
- dotenv
- Jest
- JSON Web Token (JWT)
- Mongoose
- MongoDB
- Superagent

#### `.env` requirements

- `PORT` - Port Number
- `MONGODB_URI` - URL to the running mongo instance/db
- `JWT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `TEST_TOKEN`

## Daily Log

**8/27/2020:** Phase 4: Role Based Access Control

**8/26/2020:** Phase 3: Bearer Authorization & Token Authentication

- Any user with a valid token (retrieved from either Basic Authentication or OAuth) is able to use that token to login to the system and potentially access protected routes.

**8/25/2020:** Phase 2: Integrating GitHub OAuth

- Integration with GitHub’s OAuth service to provide a way for users to easily signup and signin to the system in addition to the Basic Authentication already built.

**8/24/2020:** Phase 1: Basic Authentication

- Deploy an Express server that implements Basic Authentication, with signup and signin capabilities, using a Mongo database for storage.

#### Tests

- Test-Driven Development utilizing Jest
- Running tests: `npm test`

#### UML
