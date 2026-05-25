# VIve Monitor

## Overview

This project is a full-stack web application for simulating and monitoring
patient vitals. It maintains the simplicity and accessibility of ResusMonitor
while adding extended features and flexibility.

Current functionality includes:

* Displaying and manipulating vitals: ECG/EKG, SpO2, EtCO2 (kPa), heart rate,
  respiratory rate, systolic BP, and diastolic BP
* A frontend monitor view and controller view
* A backend Express API for reading and updating the current vitals row in
  Supabase

## Built With

### Frontend

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![MUI][MUI]][MUI-url]
* [![Three.js][Three.js]][Three-url]
* [![Chart.js][Chart.js]][Chartjs-url]
* [![Vite][Vite]][Vite-url]
* [![Vitest][Vitest]][Vitest-url]

### Backend

* [![Node][Node.js]][Node-url]
* [![Express.js][Express.js]][Express-url]
* [![Supabase][Supabase]][Supabase-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Jest][Jest]][Jest-url]

### Deployment / Hosting

* [![Vercel][Vercel]][Vercel-url]

## Prerequisites

**Before you begin, ensure you have the following installed:**

* Node.js 20.x recommended (Node.js 18.x or higher is required for React 19 and
  Three.js compatibility)
* npm version 7 or higher. npm is included with Node.js.
* Access to the project Supabase instance and its service role key.

Install Node.js from the official Node.js download page: [![Node.js]][Node-download-url]

### Verify Node.js Installation

```bash
node -v
```

This command will display the installed version of NodeJS.

### Verify npm Installation

```bash
npm -v
```

This command will display the installed version of NPM.

## Project Setup and Run Instructions

1. Clone the repository.

   ```bash
   git clone https://github.com/Online-Vitals-Monitor/Online-Vitals-Monitor.git
   cd Online-Vitals-Monitor
   ```

2. Install packages and run the backend and frontend in separate terminals.

### Backend Setup

```bash
cd backend
npm ci
```

Create `backend/.env` with the Supabase credentials. *DO NOT COMMIT THIS FILE.*

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=4000
```

To run the backend server:

```bash
npm run dev
```

The backend runs at `http://localhost:4000` by default.

### Frontend Setup

```bash
cd frontend
npm ci
```

Create `frontend/.env` and point it at the backend API:

```bash
VITE_API_URL=http://localhost:4000
```

To run the frontend server:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000` by default.

### Build

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

## Testing

The backend uses Jest for integration tests, and the frontend uses Vitest for
component tests.

To run backend tests:

```bash
cd backend
npm test
```

Backend tests require valid Supabase environment variables and network access
because they exercise the real `/api/vitals` Supabase integration.

To run frontend tests:

```bash
cd frontend
npm test
```

To run frontend tests in watch mode:

```bash
cd frontend
npx vitest
```

### Common Pitfalls

* If the frontend reports `API URL is not defined`, verify `frontend/.env`
  contains `VITE_API_URL=http://localhost:4000` and restart `npm run dev`.
* If backend startup or tests report missing Supabase variables, verify
  `backend/.env` contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
* If frontend tests cannot resolve a dependency, remove `frontend/node_modules`
  and rerun `npm ci`.

## Deployment

The backend includes a Vercel configuration in `backend/src/vercel.json`, and the
CI workflow builds and tests the frontend and backend with Node.js. Deployment
environment access and exact Vercel project settings should be transferred
separately from the repository. Required deployment secrets are `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, and the frontend `VITE_API_URL`.

## Contributors

* Lyle McCaffrey : [mccaffrl@oregonstate.edu](mailto:mccaffrl@oregonstate.edu)
* Jamie Liu      : [liujam@oregonstate.edu](mailto:liujam@oregonstate.edu)
* Madelyn Sadler : [sadlerm@oregonstate.edu](mailto:sadlerm@oregonstate.edu)
* Bryce Khut     : [khutb@oregonstate.edu](mailto:khutb@oregonstate.edu)
* Khoi Le        : [lekhoi@oregonstate.edu](mailto:lekhoi@oregonstate.edu)
* Chi Chan       : [chanc4@oregonstate.edu](mailto:chanc4@oregonstate.edu)

## Pull Request Flow

This project uses a simple pull request flow: `feature/*` branch → pull request
→ ≥1 review → merge.

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Node-download-url]: https://nodejs.org/en/download
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[MUI]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[Three.js]: https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white
[Three-url]: https://threejs.org/
[Chart.js]: https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white
[Chartjs-url]: https://www.chartjs.org/
[Jest]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://jestjs.io/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
[Vitest]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
[Vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
