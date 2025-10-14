# Copilot Instructions for Webbserverprogramering-1-book-review

## Project Overview
This project is a full-stack book review app with a Node.js/Express backend and a Vite/JS frontend. The backend manages reviews (CRUD) and persists them to a JSON file. The frontend interacts with the backend via HTTP and dynamically displays reviews.

## Architecture
- **Backend** (`server/`):
  - `app.mjs`: Starts the Express server on port 3000.
  - `server.mjs`: (Implementation expected) Should define Express routes for CRUD operations on reviews, handle file I/O for `reviews.json`, and use `uuid` for unique IDs.
  - Uses `express`, `cors`, and `uuid`.
- **Frontend** (`client/`):
  - `src/main.js`: Handles all DOM logic, form submission, and API calls to `/reviews`.
  - `index.html`: Main UI, styled inline.
  - Uses Vite for development/build (`npm run dev` in `client/`).

## Developer Workflows
- **Start Backend:**
  - `cd server && npm install && npm run dev` (uses `nodemon` for hot reload)
- **Start Frontend:**
  - `cd client && npm install && npm run dev` (Vite dev server)
- **Build Frontend:**
  - `npm run build` in `client/`
- **API Endpoint:**
  - Backend exposes `/reviews` for CRUD (see `main.js` for usage)

## Project-Specific Patterns
- **Review Storage:**
  - Reviews are stored in a JSON file (not a database). All file I/O should be async and robust to file absence/corruption.
- **ID Generation:**
  - Use `uuid` for all review IDs (see backend dependencies).
- **Frontend-Backend Integration:**
  - All review actions (add, delete, fetch) are via HTTP to the backend. See `API_URL` in `main.js`.
- **Form Handling:**
  - Frontend disables submit unless all fields are filled (see `checkInputs` in `main.js`).
- **Error Handling:**
  - Show user-friendly messages on API or validation errors.

## Conventions
- **Swedish language** is used in UI and some code comments.
- **No database**: All data is file-based.
- **No TypeScript**: Pure JS/ESM everywhere.

## Key Files
- `server/app.mjs`, `server/server.mjs`, `client/src/main.js`, `client/index.html`

## Example: Adding a Review
1. User fills form in UI (`index.html`)
2. `main.js` POSTs to `/reviews`
3. Backend saves to `reviews.json` and returns updated list
4. Frontend updates review list dynamically

---

**Update this file if you add new endpoints, change data storage, or introduce new workflows.**
