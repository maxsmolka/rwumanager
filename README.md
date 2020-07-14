Simple CRM Electron App
======================

> Max Smolka | March 13th, 2020

Simple crm dashboard app made with electron containing several views and a simple json file as database.
As part of my studies, this application was created with Electron for the informatics project. The application should outline the electron specific concepts. There are 3 different views, but additional functionality has only been implemented for one view.

<!-- ![Application-Dashboard]('customer-manager.png') -->


Repository structure
=================

- **assets/** - Graphical assets and stylesheets 
  - **app-icon/** - App icons for MacOs, Linux, Windows (ℹ️ No icons available at the moment )
  - **css/**
    - **base.css** - General app color and style definitions
    - **main.css** - App specific style definitions for the content
  - **db.js** - Local json file store, using npm package electron-store
  - **imports.js** - Attaches available sections as template-tags to the dom for later navigation
  - **navigation.js** - Routes configurator
- **renderer/**
  - **render-appointments.js** - Entry file for appointments.html
  - **render-customers.js** - Entry file for customers.html
  - **render-dashboard.js** - Entry file for dashboard.html
- **sections/** - Different views
- **index.js** - Entry file for the main process


Packages used
=================

- **electron-settings** - Store view that was active the last time the app was open. Will be loaded on restart
- **electron-packager** - Tool used for deploying to different plattforms
  - Available scripts see **package.json** 
- **devtron** - Extension to help you inspect, monitor, and debug your app
- **electron-store** - Used as basis for local json file database

Where is my data stored?
=================
The path to the database is platform dependet. It can be checked by using below command within your main process:
```bash
app.getPath() 
```
In general the following app data paths should apply for Windows and Linux users:
```bash
# Windows
C:\Users\<your-name>\AppData\Roaming\<your-app-name>
# Linux
$Home/.config/<your-app-name>/
```


Installing 
=================

```bash
git clone https://github.com/maxsmolka/rwumanager.git
cd rwumanager
npm install
npm start

```
