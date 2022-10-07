<!-- ABOUT THE PROJECT -->

## About The Project

This is a basic Application built using React.js and Node.js which allows a user to sign in with google and upload files to cloud.

### Built With

- [Node.js](https://nodejs.org)
- [React.js](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com)

### Prerequisites

- Node.js
  ```sh
  sudo apt install nodejs
  ```
- [Set up MongoDB](https://www.mongodb.com/docs/manual/installation/)

### Setup

1. Clone the github repo
   ```sh
   git clone https://github.com/romit5797/krayo.git
   ```
2. Install NPM packages
   ```sh
   cd krayo &&  npm install
   ```

### Front-end Setup

1. Install NPM packages
   ```sh
   cd front-end &&  npm install
   ```
2. Set your firebase file
   ```sh
   cd src && touch firebase.js
   ```
3. Run the server
   ```sh
   npm run start
   ```
4. Access the server
   ```sh
   http://localhost:3000/
   ```

### Back-end Setup

1. Install NPM packages
   ```sh
   cd back-end &&  npm install
   ```
2. Set your config env file to store the application secrets
   ```sh
   touch config.env
   ```
3. Run the server
   ```sh
   npm run start
   ```
4. Access the api
   ```sh
   http://localhost:3001/api/v1/
   ```

## Features

- Basic Authentication and data validation
- Login with google
- Upload files to AWS S3
- JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` will be returned in Login response. JWT Tokens are sent as secure cookies in the browser.
- Prevention against XSS attacks, parameter pollution ,secure HTTP Headers, rate limiting and Data sanitization to avoid NoSQL query Injection
- Follows MVC Architecture
- Global and local error handling middleware
- Factory handler for default operations
- App Features to handle advanced and dynmic querying in mongoose on queries like find, sort, limit or paginate
- Included CORS and static file support.
- Multiple CRUD based operations on the models
- Formatting with [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and Linting with [Eslint](https://eslint.org/).

### Creating new models

You can add more models/schemas to the project just create a new file in `./models/` and use them in the controllers.

### Creating new views

You can add more views to the project just create a new file in `./views/`

### Creating new controllers

You can add more controllers to the project just create a new file in `./controllers/` and use them in the routes.

### Creating new routes

You can add more routes to the project just create a new file in `./routes/`
