# Expresselize (Express-Sequelize)

## Description
A framework based on express-sequelize with all the basic bindings necessary for a backend server.

## Dependencies:
  ### 1. Node.js (12+) [download](https://nodejs.org/en/download/)
  ### 2. Sequelize (v6) [download]
  ### 3. NPM (Compatible with given Node version) []
  ### 3. Yarn

## Directory Structure:
- ### dist: containing files transpiled by babel (from es8 to commonJS)
- ### src: containing un-transpiled files used in development
- ### storage:
- - #### logs: contains logs.
- ### .babelrc: contains babel settings
- ### .env.example: a sample .env file that can be duplicated to set up application
- ### .eslintrc.json: eslint configs
- ### package.json: containing dependencies and other necessary details about the package
## Project Setup
- Create a database in your mysql/mariadb instance.
- Copy `.env.example` to `.env` and change it according to your needs.
- run `npm install`.
- execute `npm run migrate` to migrate the tables.
- execute `npm run dev` in to start the backend server.

## Deploy to server
- execute `npm run build`.
- copy all directories except `src` to server.
- execute `npm run start`.