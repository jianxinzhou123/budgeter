# Budget Tracker 💰

A modern, full-featured budgeting application built with Next.js 15, TypeScript, and SQLite. Track your income, expenses, and manage your financial goals with ease.

## Features ✨

- **Transaction Management**: Add, view, and delete income/expense transactions
- **Category System**: Organize transactions by customizable categories with budget limits
- **Budget Tracking**: Set spending limits for expense categories and track progress
- **Visual Summary**: See your financial overview with color-coded breakdowns
- **Date Filtering**: View transactions by month/year or see all-time data
- **Real-time Updates**: Instant UI updates with toast notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **SQLite Database**: Fast, local data storage with better-sqlite3

## Tech Stack 🛠️

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with better-sqlite3
- **Runtime**: Node.js

## Getting Started 🚀

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The database will be automatically initialized with default categories on first run.

## Project Structure 📁

```
budgeter/
├── app/
│   ├── api/                    # API routes
│   │   ├── categories/         # Category CRUD endpoints
│   │   ├── transactions/       # Transaction CRUD endpoints
│   │   └── summary/            # Budget summary endpoint
│   ├── components/             # React components
│   │   ├── AddTransactionForm.tsx
│   │   ├── BudgetSummary.tsx
│   │   ├── CategoryManager.tsx
│   │   ├── Toast.tsx
│   │   └── TransactionList.tsx
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── lib/
│   ├── db.ts                  # Database setup and initialization
│   └── types.ts               # TypeScript type definitions
└── budgeter.db                # SQLite database (auto-generated)
```

## Features in Detail 📋

### Transaction Management
- Add transactions with category, amount, description, and date
- View recent transactions with category badges
- Delete transactions with confirmation
- Color-coded income (green) and expense (red) display

### Category Management
- Create custom income and expense categories
- Set budget limits for expense categories
- Delete categories (cascades to transactions)
- Pre-populated with common categories

### Budget Tracking
- Visual progress bars for expense categories
- Over-budget warnings and calculations
- Total income, expenses, and balance summary
- Category-level breakdown with totals

### Date Filtering
- Filter by specific month and year
- "Show All Time" option for complete history
- Automatic default to current month

## API Endpoints 🔌

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

### Transactions
- `GET /api/transactions?month=X&year=Y` - List transactions (with optional filters)
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Summary
- `GET /api/summary?month=X&year=Y` - Get budget summary (with optional filters)

## Database Schema 💾

### Categories Table
- `id` - Primary key
- `name` - Category name (unique)
- `type` - 'income' or 'expense'
- `budget_limit` - Monthly budget limit (for expenses)
- `created_at` - Timestamp

### Transactions Table
- `id` - Primary key
- `category_id` - Foreign key to categories
- `amount` - Transaction amount
- `description` - Optional description
- `date` - Transaction date
- `created_at` - Timestamp

## Scripts 📜

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Default Categories 🏷️

The app comes pre-configured with:

**Expenses:**
- Groceries ($500 limit)
- Utilities ($200 limit)
- Transportation ($150 limit)
- Entertainment ($100 limit)
- Healthcare ($200 limit)

**Income:**
- Salary
- Freelance

## Future Enhancements 🔮

Potential features to add:
- Data export (CSV, PDF)
- Charts and graphs
- Recurring transactions
- Multi-currency support
- Budget goals and projections
- Category icons
- Dark mode toggle
- Data backup/restore

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is open source and available under the MIT License.
