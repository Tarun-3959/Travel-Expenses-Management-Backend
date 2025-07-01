# Trip Tally - Travel Expense Management System 🧳💸

A full-stack web application that helps users **plan trips**, **track expenses**, and **analyze spending** to stay within their travel budget.

---

## ✨ Features

- **User Authentication:** Secure signup and login with JWT tokens.
- **Trip Management:** Create, view, delete trips.
- **Expense Tracking:** Add expenses to trips and categorize them.
- **Budget Monitoring:** Keep track of the total expenses vs. trip budget.

- **Analysis Buttons:** It helps to analyse expenses.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)

---

## 🗂️ Project Structure

```
trip-tally/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── app.js
├── frontend/
│   ├── pages/
│   ├── styles/
│   ├── scripts/
│   └── index.html
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file in backend directory:**

   ```bash
   PORT=3000
   MONGODB_URL=<your-mongodb-url>
   ACCESS_TOKEN_SECRETE_KEY=<your-secret-key>
   ```

4. **Run the server:**

   ```bash
   npm run dev
   ```

5. **Open `frontend/index.html` in your browser.**

---

# 📚 API Documentation

### Authentication Routes

#### 1. Signup User

- **URL:** `POST /auth/signup`
- **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

- **Success Response:**

```json
{
  "message": "User created successfully",
  "token": "jwt_token"
}
```

#### 2. Signin User

- **URL:** `POST /auth/signin`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

- **Success Response:**

```json
{
  "message": "User logged in successfully",
  "token": "jwt_token"
}
```

### Trip Routes

(All these routes require Authorization header: `Bearer <jwt_token>`)

#### 3. Create Trip

- **URL:** `POST /trips/`
- **Body:**

```json
{
  "tripName": "Goa Vacation",
  "destination": "Goa",
  "startDate": "2025-05-01",
  "endDate": "2025-05-10",
  "totalBudget": 50000
}
```

- **Success Response:**

```json
{
  "message": "Trip created successfully",
  "trip": { ... }
}
```

#### 4. Get All Trips of Logged-in User

- **URL:** `GET /trips/`
- **Success Response:**

```json
{
  "message": "Trips fetched successfully",
  "trips": [ { ... }, { ... } ]
}
```

#### 5. Delete a Trip

- **URL:** `DELETE /trips/:id`
- **Success Response:**

```json
{
  "message": "Trip deleted successfully"
}
```

### Expense Routes

#### 6. Create Expense

- **URL:** `POST /expenses/`
- **Body:**

```json
{
  "tripId": "<trip_id>",
  "expenseTitle": "Dinner at beach",
  "amount": 1200,
  "category": "Food"
}
```

- **Success Response:**

```json
{
  "message": "Expense added successfully",
  "expense": { ... }
}
```

#### 7. Get All Expenses of a Trip

- **URL:** `GET /expenses/:tripId`
- **Success Response:**

```json
{
  "message": "Expenses fetched successfully",
  "expenses": [ { ... }, { ... } ]
}
```

#### 8. Delete an Expense

- **URL:** `DELETE /expenses/:expenseId`
- **Success Response:**

```json
{
  "message": "Expense deleted successfully"
}
```

---

# 🔐 Important Notes

- All secured routes require a valid JWT token in the `Authorization` header.
  Example:

  ```
  Authorization: Bearer <jwt_token>
  ```

- Tokens are stored in localStorage on successful login/signup.

- If the token expires, the user will be redirected to login again.

---

# 🚀 Future Enhancements

- Pie chart analysis for expenses (category wise)
- Edit Trip and Expense functionalities
- Advanced filters and sorting on trips and expenses
- Admin dashboard for analytics
- Clean UI optimized for all devices.

---

# 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

# 📧 Contact

For any queries or feedback, feel free to connect!

---

> **Made with ❤️ for all Travel Lovers** 🌏
