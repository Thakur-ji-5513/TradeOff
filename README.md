# TradeOff

TradeOff is a full-stack MERN web application that helps users make smarter financial decisions by translating purchase prices into the amount of time they must work to afford them.

Instead of asking *“Can I afford this?”*, TradeOff asks:

> “Is this worth X hours of my life?”

---

## 🧠 Core Idea

Users enter their income and working hours during onboarding.

When evaluating a purchase, the app calculates:

- 🕒 Hours of work required  
- 📊 Percentage of monthly income  
- 🏷️ Category impact (Need / Want / Luxury)  
- ⏳ A reflective decision step (Buy Now or Wait 24 Hours)

The goal is psychological clarity — not complex financial planning.

---

## 🚀 Features (MVP)

- Minimal onboarding flow  
- Automatic hourly value calculation  
- Time-based purchase impact analysis  
- 24-hour pause mechanism  
- Pending decisions tracking  
- Purchase history  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Modern CSS styling

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Architecture
- RESTful API design
- Modular folder structure
- Clean separation of frontend and backend

---

## 📂 Project Structure

```
TradeOff/
│
├── client/        # React frontend
├── server/        # Express + MongoDB backend
└── README.md
```

---

## 🧩 System Architecture

- `client/` handles UI and state management  
- `server/` handles API routes and database logic  
- MongoDB stores users and purchase records  
- Time-cost calculations are derived dynamically  

---

## 📌 Why This Project?

TradeOff focuses on behavioral decision-making rather than traditional budgeting tools.

It demonstrates:

- Full-stack development using MERN  
- API route structuring and database modeling  
- React component architecture  
- Product-focused UX thinking  
- Clean, scalable project setup  

---

## 🔮 Future Improvements

- Authentication (JWT-based login system)
- Spending insights dashboard
- Pattern analysis by category
- Reminder notifications for pending decisions
- Cloud deployment

---

## 📄 License

This project is built for educational and portfolio purposes.
