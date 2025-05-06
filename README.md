<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sandstorm831/patient_holder">
    <img src="public/helping_hands.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">patient_Holder</h3>

  <p align="center">
    pH is a react implementaion of in browser database with multi-tab wroker
    <br />
    <br />
    <a href="https://phcom.vercel.app">View Demo</a>
    &middot;
    <a href="https://github.com/sandstorm831/patient_holder/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/sandstorm831/patient_holder/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#built-with">Built with</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#license">License</a></li>
  </ol>

<!-- ABOUT THE PROJECT -->

## About The Project

patient_Holder(pH) is an implementation of [PGlite](https://pglite.dev) library which is a embeddable Postgres in WASM build. I used an indexedDB to persist data across refreshes and used a multi-tab worker to share data across multiple tabs of the same browser. You can add any patient record in `register patient` tab and can query patient's data from `find patient record` tab. It uses `SQL` queries under the hood for all the db operations.

### Built With

[![Vite][vite]][vite-url]
[![React][React.js]][React-url]
[![TailWindCSS][tailwindcss]][tailwindcss-url]
[![NodeJS][nodejs]][nodejs-url]
[![TypeScript][typescript]][typescript-url]

## Prerequisites

To run the project in your local machine, you must have

- Node.js : [Volta recommended](https://volta.sh/)

## Installation

Once you finish installation Node.js, follow the commands to setup the project locally on your machine

1. clone the project
   ```sh
   git clone https://github.com/Sandstorm831/patient_holder.git
   ```
2. enter the project
   ```sh
   cd patient_holder
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Make a production build
   ```sh
   npm run build
   ```
5. Preview the build
   ```sh
   npm run preview
   ```
   This completes the set-up for this project, all the functionalities present in the application will now be live at `localhost:4173`. You can view a hosted demo of the same [here](https://phcom.vercel.app).

<!-- LICENSE -->

## License

Distributed under the GPL-3.0 license. See [LICENSE](./LICENSE) for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/sandstorm831/chessdom.svg?style=for-the-badge
[contributors-url]: https://github.com/sandstorm831/chessdom/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sandstorm831/chessdom.svg?style=for-the-badge
[forks-url]: https://github.com/sandstorm831/chessdom/network/members
[stars-shield]: https://img.shields.io/github/stars/sandstorm831/chessdom.svg?style=for-the-badge
[stars-url]: https://github.com/sandstorm831/chessdom/stargazers
[issues-shield]: https://img.shields.io/github/issues/sandstorm831/chessdom.svg?style=for-the-badge
[issues-url]: https://github.com/sandstorm831/chessdom/issues
[license-shield]: https://img.shields.io/github/license/sandstorm831/chessdom.svg?style=for-the-badge
[license-url]: https://github.com/sandstorm831/chessdom/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: public/chessdom_knight.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[Socket-url]: https://socket.io/
[Socket-url]: https://socket.io/
[prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[tailwindcss]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwindcss-url]: https://tailwindcss.com/
[nodejs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev
