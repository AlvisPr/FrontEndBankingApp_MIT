# Deposit Application

This project is a simple deposit application built with React. It allows users to deposit money into their account after logging in.

## Features

- User login
- Display current balance
- Deposit money
- User-friendly interface

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/deposit-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd deposit-app
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the development server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Components

### Deposit.js

This component handles the deposit functionality. It displays the current balance and a form to enter the deposit amount. If the user is not logged in, it prompts the user to log in.

#### Key Functions

- `handleDeposit`: Handles the deposit action by updating the user's balance and resetting the input field.
- `setStatus`: Updates the status message displayed to the user.

#### JSX Structure

- `Card`: Displays the deposit form or a login prompt.
- `TooltipIcon`: Provides additional information about the deposit form.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License.