# Coronavirus Visualization <img alt="Travis CI badge" src="https://travis-ci.org/nathanielhall/meteorite-impact-visualization.svg?branch=refactor">

> COVID-19 visualization across the United States using React and React-Leaflet
> Map. The data comes from
> [COVID-19 API](https://github.com/mathdroid/covid-19-api) and
> [Coronavirus Tracker API](https://github.com/ExpDev07/coronavirus-tracker-api)

## System Requirements

- [Git](https://git-scm.com/) v2 or greater
- [NodeJS](https://nodejs.org/en/) v11 or greater
- [npm](https://www.npmjs.com/) v6 or greater

## Setup

```shell
git clone https://github.com/nathanielhall/coronavirus-visualization.git
cd coronavirus-visualization
npm install
```

## Running the app

```shell
npm start
```

This will launch the application in your browser at `http://localhost:8080`. If
the browser doesn't open, try typing in the address.

This is what you are looking for:

<img src="app_screenshot.png" alt="App Screenshot" title="App Screenshot" width="700" />

## Scripts

| `npm <script>` | Description               |
| -------------- | ------------------------- |
| `build`        | generate production build |
| `start`        | run dev server            |
| `lint`         | lint ts(x) files          |
| `test`         | run jest                  |
| `prettier`     | run prettier              |
