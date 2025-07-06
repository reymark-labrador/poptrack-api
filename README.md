# PropTrack API

A property management backend API built with Node.js, Express, TypeScript, and MongoDB.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or remote instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/reymark-labrador/poptrack-api.git
   cd poptrack-api
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**

   - Copy `env.example` to `.env.local` (or `.env.development`, `.env.staging`, `.env.production` as needed):
     ```bash
     cp env.example .env.local
     ```
   - Update the MongoDB URI and other variables as needed in your `.env.local` file.

4. **Start the server:**

   ```bash
   npm run local
   ```

   The API will be running at [http://localhost:5000](http://localhost:5000)

5. **API Documentation:**
   - Swagger UI is available at [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### MongoDB URI

You can use the following sample configuration in your `.env.local` file:

```
MONGO_URI=mongodb+srv://admin:XIkR2NRZnO9Q2T3@poptrack-staging.no9pszz.mongodb.net/poptrack?retryWrites=true&w=majority&appName=poptrack-staging
DB_NAME=poptrack
PORT=5000
```

_This URI and configuration were used for testing during development._

---

## 🖼️ Screenshots / Demo

<img src="https://private-user-images.githubusercontent.com/12556008/462896907-f3d8d8c2-85f6-407a-bc3b-7dccec1c1881.jpeg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTE3OTY0MDgsIm5iZiI6MTc1MTc5NjEwOCwicGF0aCI6Ii8xMjU1NjAwOC80NjI4OTY5MDctZjNkOGQ4YzItODVmNi00MDdhLWJjM2ItN2RjY2VjMWMxODgxLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNzA2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDcwNlQxMDAxNDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00YTU3OWM0MGVkOGU2NTFlODZmNzUzODU5MjQwZTRkODM0YzY3MDdkM2IyMThlNTliZjAyN2FhYmUyM2VlYmM2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Av63IHNsSCMz7IiE-IP6VvIb8APRmRbA7o94xP1TFXo" height="350"/>

---

## 📝 Assumptions

- MongoDB is available and accessible at the URI provided in the environment variables.
- The API is primarily for backend use; no frontend is included in this repository.
- Environment variables are managed via `.env` files as per the example.
- MongoDB indexing is used to optimize queries on properties for better performance.

---

## ⚙️ Technical Choices & Rationale

- **Node.js + Express:** Fast, flexible, and widely adopted for REST APIs.
- **TypeScript:** Ensures type safety and better developer experience.
- **MongoDB + Mongoose:** Flexible schema for property management, with advanced indexing for performance.
- **Swagger (swagger-jsdoc + swagger-ui-express):** Auto-generated, interactive API documentation.
- **CORS:** Configurable for different environments (local, staging, production).
- **Environment-based config loading:** Loads `.env.{NODE_ENV}` for flexible deployments.
- **Nodemon + ts-node:** For efficient local development with hot-reloading.

---

## 🔮 Future Plans / Improvements

- Add authentication and authorization (JWT-based).
- Implement more robust validation and error handling.
- Add unit and integration tests.
- Add rate limiting and security best practices.
- Implement advanced search (geospatial, full-text, etc.).
- Add Docker support for easier deployment.

---

## 🌟 Stretch Goals / Bonus Features

- Advanced MongoDB indexing for search and performance.
- Swagger UI for easy API exploration.
- Modular route/controller structure for scalability.

---

## ⚡ Shortcuts / Compromises

- No authentication/authorization implemented yet.
- Minimal error handling and validation for brevity.
- No frontend included in this repository.
- No automated tests included.

---

## ⏱️ Time Spent

Total time spent: **16 hours**

---

## 🛠️ Resources & Technologies Used

- Node.js, Express, TypeScript
- MongoDB, Mongoose
- Swagger (swagger-jsdoc, swagger-ui-express)
- dotenv, nodemon, ts-node
- CORS
