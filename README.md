# Online-Vitals-Monitor Project

## Overview
This project is a full-stack web application vitals monitor that maintains the simplicity and accessibility of ResusMonitor while adding extended features and flexibility.
* Display and manipulate waveforms: ECG/EKG, SpO<sub>2</sub>, EtCO<sub>2</sub> (kPa), Heart Rate, Respiratory Rate, Systolic BP, Diastolic BP, 
* Host monitor sessions
* Connect to hosted monitor sessions
* More features soon to be implemented
## Built With
**Frontend**
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![MUI][MUI]][MUI-url]
* [![Three.js][Three.js]][Three-url]	
* [![Chart.js][Chart.js]][Chartjs-url]

**Backend**
* [![Node][Node.js]][Node-url]
* [![Express.js][Express.js]][Express-url]
* [![Supabase][Supabase]][Supabase-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Jest][Jest]][Jest-url]

## Prerequisites
**Before you begin, ensure you have the following installed:**

**Node.js: Version 18.x or higher (Required for React 19 and Three.js compatibility)**
**npm: Version 7 or higher**

Click here to install the environment: [![Node.js]][Node-download-url]

**Verify NodeJS installation**
```bash
node -v
```
This command will display the installed version of NodeJS.


**Verify NPM installation**
   ```bash
   npm -v
   ```
This command will display the installed version of NPM.

## Project Setup and Run Instructions
1. Clone the repository
   ```bash
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install packages and run project on frontend and backend
### Backend Setup (within backend directory)

```bash
npm install
```
*To run the backend server*  
```bash
npm run dev
```
### Frontend Setup (within frontend directory)
*To run the frontend server*  
```bash
npm start
```
## Testing
Both the frontend and backend are equipped with Jest for unit and integration testing.

* To run backend tests: 
```bash 
cd backend && npm test
```

* To run frontend tests: 
```bash 
cd frontend && npm test
```

## Contributors
- Lyle McCaffrey : [mccaffrl@oregonstate.edu](mailto:mccaffrl@oregonstate.edu)
- Jamie Liu      : [liujam@oregonstate.edu](mailto:liujam@oregonstate.edu)
- Madelyn Sadler : [sadlerm@oregonstate.edu](mailto:sadlerm@oregonstate.edu)
- Bryce Khut     : [khutb@oregonstate.edu](mailto:khutb@oregonstate.edu)
- Khoi Le        : [lekhoi@oregonstate.edu](mailto:lekhoi@oregonstate.edu)
- Chi Chan       : [chanc4@oregonstate.edu](mailto.chanc4@oregonstate.edu)

## Pull Request Flow
This project uses a simple pull request flow of feature/* → PR → ≥1 review → merge

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[product-screenshot]: images/screenshot.png

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
