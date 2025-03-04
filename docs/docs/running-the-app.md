---
sidebar_position: 3
---

# Running the Application

This guide will show you how to run the Crypto Price Tracker application locally.

## Starting the Web Application

From the project root, navigate to the web application directory:

```bash
cd web-app
```

Start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the Next.js development server, typically at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build of the web application:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Running the Documentation

From the project root, navigate to the documentation directory:

```bash
cd docs
```

Start the Docusaurus development server:

```bash
npm run start
# or
yarn start
```

This will start the Docusaurus server, typically at [http://localhost:3000](http://localhost:3000). If the web application is already running on port 3000, Docusaurus will automatically use a different port.

## Building the Documentation

To create a production build of the documentation:

```bash
npm run build
# or
yarn build
```

To serve the built documentation:

```bash
npm run serve
# or
yarn serve
```
