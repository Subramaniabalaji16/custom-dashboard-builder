Deployment Link : https://custom-dashboard-builder-iota.vercel.app

# Custom Dashboard Builder

A full-stack web application for managing customer orders and building 
custom analytics dashboards with drag-and-drop widgets.

## Features

- Drag-and-drop dashboard builder with 7 widget types
- KPI cards with Sum, Average, and Count aggregations  
- Bar, Line, Area, Scatter, and Pie charts
- Data tables with pagination, sorting, and column filtering
- Full order management — Create, Edit, Delete, Bulk Delete
- Date filtering — Today, 7 days, 30 days, 90 days
- Responsive layouts for desktop, tablet, and mobile
- Dashboard configuration persisted to MongoDB


## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Zustand — state management
- React Grid Layout — drag and drop
- Recharts — data visualization
- React Hook Form — form validation
- Tailwind CSS — styling
- Axios — HTTP client

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- REST API



## Project Structure

```
├── src/
│   ├── api/            # Axios API clients
│   ├── components/     # UI components (widgets, builder, orders, settings)
│   ├── pages/          # Dashboard, Builder, Orders pages
│   ├── store/          # Zustand state stores
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Aggregation, filtering, chart, table helpers
│
└── server/
    └── src/
        ├── models/     # Mongoose schemas (Order, DashboardConfig)
        ├── routes/     # Express routes (orders, dashboard)
        ├── db.ts       # MongoDB connection
        └── index.ts    # Server entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB local or Atlas connection string

### 1. Clone the repo
```bash
git clone https://github.com/Subramaniabalaji16/custom-dashboard-builder.git
cd custom-dashboard-builder
```

### 2. Configure environment variables

`.env` (root):
```
VITE_API_URL=http://localhost:4000
```

`server/.env`:
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the backend
```bash
cd server
npm install
npm run dev
```

### 4. Run the frontend
```bash
npm install
npm run dev
```

Visit http://localhost:5173

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |
| DELETE | /api/orders | Bulk delete orders |
| GET | /api/dashboard | Get dashboard config |
| PUT | /api/dashboard | Save dashboard config |

---

## Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

