# VisaVista CRM

A web CRM for education / visa consultancies. React + Vite + JavaScript, IBM Carbon design language.

## Run
```bash
npm install
npx msw init public/ --save
npm run dev
```

Open the printed URL. The app boots with seeded demo data (10 students, 15 cases). `localStorage.clear()` then refresh to reseed.

## Demo logins
- **Admin:** click "Sign in as Admin" on the login page.
- **Counsellor:** click "Sign in as Counsellor."

## Architecture (1-minute version)
```
UI component  →  feature hook (useStudents)  →  feature service (studentsService)
              →  apiClient (fetch '/api/...')  →  [MSW handler  →  mock DB in localStorage]
```

The dotted line is `src/services/apiClient.js`. Above = UI. Below = data source. The mock and a future real backend are interchangeable because both speak the same `/api/*` contract.

## Switching to a real backend
1. Delete (or guard out) the MSW import block in `src/main.jsx`.
2. Add `VITE_API_BASE_URL=https://your.api` to `.env`.
3. Ensure the backend matches the endpoint contract in `TECHNICAL-PRD.md` §3.

Nothing in `src/features/**` should change.

## Read before contributing
- `TECHNICAL-PRD.md` — scope, architecture, folder rules.
- `DESIGN.md` — design tokens. The only file that defines colors / fonts / spacing.
- `CLAUDE.md` — short pointer for AI tools.
