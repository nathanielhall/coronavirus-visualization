# Coronavirus Visualization <img alt="Travis CI badge" src="https://travis-ci.org/nathanielhall/meteorite-impact-visualization.svg?branch=refactor">

> COVID-19 dashboard across the United States using the ReCharts and
> [Covid Tracking API](https://covidtracking.com/data/api)

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
