# webapp

### Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** is downloaded on your local machine
- **MySQL** is downloaded and running

---

### Build and Deploy

Prequisites to build and deploy the web application locally, follow these steps:

1. **Clone the Repository**  
   Clone the repository to your local machine:
   ```bash
   git clone SSHURL
   ```

2. **Navigate to the Project Directory**  
   Move into the project folder:
   ```bash
   cd webapp
   ```

3. **Install Dependencies**  
   Install all required dependencies:
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and configure it as follows:
   ```bash
   NODE_ENV=development
   DB_NAME=your_db_name
   DB_USERNAME=your_db_user
   DB_HOST=localhost
   DB_PASSWORD=your_db_password
   DB_DIALECT=mysql
   PORT=3000
   ```
   Replace the placeholders with your **MySQL** credentials.

5. **Run the Application**  
   Start the application:
   ```bash
   node index.js
   ```

6. **Access the Web Application**  
   Open your browser and navigate to:
   ```bash
   http://localhost:3000
   ```
