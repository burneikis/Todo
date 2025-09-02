# Full Stack Todo Web App Plan

## Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with TypeScript
- **Database**: PostgreSQL
- **Additional Tools**: Express.js, Prisma/TypeORM, React Query/SWR

## Database Schema

### Tables
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (optional)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#007bff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todo-Category junction table
CREATE TABLE todo_categories (
  todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, category_id)
);
```

## Backend API Structure

### Project Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── todoController.ts
│   │   └── categoryController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Todo.ts
│   │   └── Category.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── todos.ts
│   │   └── categories.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── todoService.ts
│   │   └── categoryService.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── package.json
└── tsconfig.json
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

#### Todos
- `GET /api/todos` - Get all todos for user
- `POST /api/todos` - Create new todo
- `GET /api/todos/:id` - Get specific todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion

#### Categories
- `GET /api/categories` - Get all categories for user
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Frontend Structure

### Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoFilters.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTodos.ts
│   │   └── useCategories.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── todoService.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Key Features

### Core Features
1. **User Authentication**
   - Registration and login
   - JWT-based authentication
   - Protected routes

2. **Todo Management**
   - Create, read, update, delete todos
   - Mark todos as complete/incomplete
   - Set priority levels
   - Add due dates

3. **Organization Features**
   - Categories for todos
   - Filter by status, priority, category
   - Search functionality

### Advanced Features
1. **Real-time Updates** (WebSocket)
2. **File Attachments**
3. **Collaborative Todos**
4. **Mobile Responsive Design**
5. **Dark/Light Theme Toggle**

## Development Phases

### Phase 1: Foundation
1. Set up backend with Express and PostgreSQL
2. Implement user authentication
3. Create basic todo CRUD operations
4. Set up React frontend with routing

### Phase 2: Core Features
1. Implement todo management UI
2. Add filtering and search
3. Create categories system
4. Add responsive design

### Phase 3: Enhancement
1. Add priority and due date features
2. Implement real-time updates
3. Add theme switching
4. Performance optimization

### Phase 4: Polish
1. Add animations and transitions
2. Implement error handling
3. Add loading states
4. Write tests

## Environment Setup

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "helmet": "^6.0.0",
    "dotenv": "^16.0.0",
    "bcryptjs": "^2.4.0",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.8.0",
    "prisma": "^4.0.0",
    "@prisma/client": "^4.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/pg": "^8.6.0",
    "typescript": "^4.8.0",
    "ts-node": "^10.9.0",
    "nodemon": "^2.0.0"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.0",
    "axios": "^1.1.0",
    "react-query": "^3.39.0",
    "styled-components": "^5.3.0",
    "react-hook-form": "^7.36.0",
    "date-fns": "^2.29.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/styled-components": "^5.1.0",
    "typescript": "^4.8.0",
    "vite": "^3.1.0"
  }
}
```

## Security Considerations
1. Input validation and sanitization
2. SQL injection prevention
3. XSS protection
4. CSRF protection
5. Rate limiting
6. Secure password hashing
7. JWT token expiration and refresh

## Testing Strategy
1. **Backend**: Unit tests with Jest, integration tests
2. **Frontend**: Component tests with React Testing Library
3. **E2E**: Cypress or Playwright tests
4. **API**: Postman/Insomnia collections

## Deployment
1. **Backend**: Deploy to Heroku, Railway, or DigitalOcean
2. **Frontend**: Deploy to Vercel, Netlify, or similar
3. **Database**: PostgreSQL on cloud provider
4. **Environment Variables**: Secure configuration management