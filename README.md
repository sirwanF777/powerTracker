

# 1. Project Overview

- **Project Name:** Electricity Consumption Backend  
- **Description:**  
  The backend section of the PowerTracker project is a system for managing and analyzing electricity consumption. It includes various APIs for user registration, authentication, electricity consumption tracking, and forecasting over different time intervals (hourly, daily, weekly, monthly). This backend uses the **Express.js** framework for creating and managing APIs.

---

# 2. Prerequisites

### **Required Tools**  
- [![Node.js](https://img.shields.io/badge/Node.js-v18.*-green)](https://nodejs.org/en/download) [Version 18 or higher](https://nodejs.org/en/download)  
- [![MongoDB](https://img.shields.io/badge/MongoDB-v4.*-green)](https://www.mongodb.com/try/download/shell) [Version 4 or higher](https://www.mongodb.com/try/download/shell)  
- ![npm](https://img.shields.io/badge/npm-v8.*-red) [Version 8 or higher](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

### **Main Packages Used**
- [![express](https://img.shields.io/badge/express-v4.21.*-green)](https://www.npmjs.com/package/express): For managing servers and routes  
- [![mongoose](https://img.shields.io/badge/mongoose-v8.*-green)](https://www.npmjs.com/package/mongoose): For managing MongoDB databases  
- [![bcrypt](https://img.shields.io/badge/bcrypt-v5.*-green)](https://www.npmjs.com/package/bcrypt): For hashing passwords  
- [![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-v9.*-green)](https://www.npmjs.com/package/jsonwebtoken): For user authentication using JWT  
- [![arima](https://img.shields.io/badge/arima-v*-green)](https://www.npmjs.com/package/arima): For forecasting electricity consumption  
- [![winston](https://img.shields.io/badge/winston-v3.15.*-green)](https://www.npmjs.com/package/winston): For managing logs  

### **Additional Packages**
[![cors](https://img.shields.io/badge/cors-v2.8.2-blue)](https://www.npmjs.com/package/cors)  [![dotenv](https://img.shields.io/badge/dotenv-v16.4.5-blue)](https://www.npmjs.com/package/dotenv) [![joi](https://img.shields.io/badge/joi-v17.13.3-blue)](https://www.npmjs.com/package/joi) [![body-parser](https://img.shields.io/badge/body%20parser-v1.20.3-blue)](https://www.npmjs.com/package/body-parser) [![cookie parser](https://img.shields.io/badge/cookie%20parser-v1.4.7-blue)](https://www.npmjs.com/package/cookie-parser)

---

# 3. Setup Instructions

### **Steps to Install and Run Locally**
1. **Clone the project repository:**
   ```bash
   git clone https://github.com/sirwanF777/powerTracker.git
   cd PowerTracker
2.  **Install dependencies:**
    
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**  
    In the project's root directory, create a `.env` file and configure the following variables:
    
    ```env
    # Server
    URL=http://localhost:8888
    PORT=8888
    HOST=localhost
    
    # Database (Mongoose)
    MONGO_DB_URL=mongodb://localhost:27017/powerTracker
    MONGO_DB_HOST=localhost
    MONGO_DB_PORT=27017
    MONGO_DB_DATABASE=powerTracker
    
    # Logs
    LOG_LEVEL=info
    INFO_LOG_PATH=./src/logs/info.log
    ERROR_LOG_PATH=./src/logs/error.log
    REQUEST_LOG_PATH=./src/logs/request.log
    
    # JWT (JSON Web Token)
    JWT_SECRET=your-secret-key
    
    ```
    
4.  **Run the project:**  
    ```bash
    node ./server.js    
    ```
----------

# 4. Features
The backend of this project includes the following features:

-   **User registration and login with secure hashed passwords.**
-   **JWT-based authentication and token management.**
-   **Electricity consumption forecasting for hourly, daily, weekly, and monthly intervals.**
-   **Customizable time ranges for electricity consumption analysis.**
-   **Comprehensive logging of requests and errors for better system management.**

----------

# 5. API Endpoints

### **User Registration:**

-   **Endpoint:**  
    `POST /api/auth-user/signup`
-   **Request Body:**
    
    ```json
    {
        "userName": "user1", // required
        "password": "password", // required
        "email": "user1@example.com" // required
    }
    
    ```
    
-   **Response:**
    
    ```json
    {
        "message": "New User Information Has Been Successfully Registered.",
        "userName": "user1",
        "email": "user1@example.com"
    }
    
    ```
    

### **User Login:**

-   **Endpoint:**  
    `POST /api/auth-user/login`
-   **Request Body:**
    
    ```json
    {
        "userName": "user1",
        "password": "password"
    }
    
    ```
    
-   **Response:**
    
    ```json
    {
        "message": "User Login Was Successful. Name: Exp_1",
        "userName": "user1"
    }
    
    ```
    

### **User Logout:**

-   **Endpoint:**  
    `POST /api/auth-user/logout`
-   **Response:**
    
    ```json
    {
        "message": "Logged Out Successfully."
    }
    
    ```
    

### **Electricity Consumption:**

-   **Endpoints:**
    -   Without specifying a time range:  
        `GET /api/electricity/consumption/weekly`
    -   With a specified time range:  
        `GET /api/electricity/consumption/daily?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd`
-   **Response:**
    
    ```json
    {
        "actualData": [...],
        "predictedData": [...]
    }
    
    ```
    

----------

# 6. Project Structure

The backend project structure is as follows:

```
src/
  controllers/      # Manages API requests and responses
  routers/          # Defines the application's routes
  middlewares/      # Middleware functions (e.g., authentication, validation)
  services/         # Core business logic and data processing
  models/           # Database models (e.g., User, Electricity)
  config/           # Configuration files (e.g., logger settings)
  utils/            # Utility functions (e.g., error handling)
  validations/      # Input validation for requests
  logs/             # Stores application logs

```

----------

# 7. License

This project is licensed under the **MIT License**, allowing you to use it for personal or commercial purposes.

----------

# 8. Contact

For questions or suggestions, feel free to contact the project developer:

-   **Email:** [sirwan.farajpanah79@gmail.com](mailto:sirwan.farajpanah79@gmail.com)
-   **GitHub:** [SirwanF777](https://github.com/SirwanF777)

----------

# 9. Project Status

This project is currently under development and may undergo changes in the future. Stable versions will be released once core features are completed.

```

---

### **Highlights:**
- The README now focuses exclusively on the backend.
- Provides clear instructions for setup, features, and API usage.
- Includes a detailed project structure and package list.

Let me know if further adjustments are needed! 🚀

```