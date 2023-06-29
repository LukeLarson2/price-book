# README

## Introduction
This README file provides instructions on how to run the app locally. Please follow the steps below to set up the app on your machine.

## Prerequisites
Before running the app locally, make sure you have the following:

- MongoDB account with access to your Database URI key
- Stripe account with access to a Stripe test environment secret key
- Visual Studio Code
- Node.js installed

## Getting Started
To run this app locally, please follow these steps:

1. Download the app files.
2. Unzip the files to a desired location on your machine.
3. Open Visual Studio Code.
4. Open the folder containing the app files in Visual Studio Code.
5. Open two terminals in Visual Studio Code.
   - In one terminal, navigate to the "frontend" directory.
   - In the other terminal, navigate to the "backend" directory.

## Installation
In each terminal, run the following command to install the dependencies:

```bash
npm install
```

> Note: If you prefer to use `yarn`, you can replace `npm` with `yarn` in the above command.

## Environment Variables
In the "backend" folder, create a file named `.env`. Inside this file, set the following environment variables:

```plaintext
PORT=4000
DB_URI=YOUR_DATABASE_SECRET_URI
JWT_SECRET=YOUR_SECRET_JWT_TOKEN
PRICE_ID_1=YOUR_STRIPE_PRODUCT_PRICE_ID_1
PRICE_ID_2=YOUR_STRIPE_PRODUCT_PRICE_ID_2
STRIPE_TEST_KEY=YOUR_STRIPE_TEST_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET_KEY
```

> Note: Replace `YOUR_DATABASE_SECRET_URI`, `YOUR_SECRET_JWT_TOKEN`, `YOUR_STRIPE_PRODUCT_PRICE_ID_1`, `YOUR_STRIPE_PRODUCT_PRICE_ID_2`, `YOUR_STRIPE_TEST_KEY`, and `YOUR_STRIPE_WEBHOOK_SECRET_KEY` with your actual values.

## Running the App
1. In the terminal located in the "backend" directory, run the following command to start the backend server:

```bash
node server
```

2. In the terminal located in the "frontend" directory, run the following command to start the frontend development server:

```bash
npm start
```

## Conclusion
After following these steps, the app should be up and running locally on your machine. You can access it by opening a web browser and navigating to the appropriate address (usually http://localhost:3000/).

If you encounter any issues or have any questions, please don't hesitate to reach out for support.
