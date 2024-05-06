## Note

This is the parent directory of the project. You can see two different repositories: 1. client, which has been developed using Next.js, and 2. the server, which has been developed using Nest.js.

To start both the client and server, let's begin with the server. Navigate to the server repository and create the new .env file and paste content from .env.development file. After completing this step, follow the instructions below. Update: just for demo purposes, I already loaded the .env file for convenience.

## Server Installation

```bash
$ cd server

$ npm install
```

## Running the server

```bash
# development
$ npm run start

## Test

# unit tests
$ npm run test
```

## Client installation

```bash
$ cd client

$ npm install
```

## Running the app

```bash
$ npm run dev
```

## Notes About the App

- You can add any email to enter into the application.
- I have allowed my Atlas MongoDB to be accessed from anywhere. So, you will be populated with remote data from my database.
- I have already created a product collection in database.
- You can update any product and see the logs.
- It will show its last value and current value its updated with.
- It will also have user details.

## Postman API Collection

- please take a look at the HCS.postman_collection.json file in the root folder. You can import the file in your postman and test the API.
