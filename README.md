# Google Sheets and MySQL Synchronization

## Project Overview

This project provides a system to synchronize data between Google Sheets and a MySQL database. It enables users to upload JSON files, automatically create Google Sheets, and keep the MySQL database updated with the latest data from the sheets.

## Features

1. **Upload JSON Files**: 
   - Users can upload JSON files through the provided controllers, which generate `sheets.json` and `sql.json`.

2. **Google Sheet Creation**: 
   - Automatically creates a Google Sheet using the Google Sheets API, with a link sent to the user's email.

3. **Polling for Updates**: 
   - Polls the Google Sheet every 10 seconds (adjustable) to check for updates, detecting changes using the Google Drive API.

4. **Format Conversion**: 
   - Converts updated `sheets.json` to `sql.json` for MySQL compatibility using a function called `sheet2sql`.

5. **Data Synchronization**: 
   - Updates the MySQL database with the latest data from `sql.json`.

6. **Deletion Operations**: 
   - Provides functionality to delete Google Sheets and MySQL tables, along with cleanup of associated files.

## Approach

### 1. Data Ingestion and JSON File Processing

- **Upload JSON Files**: Users upload JSON files through the provided controllers. These files are processed to generate two JSON files: `sheets.json` and `sql.json`.
  - **`sheets.json`**: Represents the data structure and content for the Google Sheet.
  - **`sql.json`**: Defines the table schema and data rows for the MySQL database.

### 2. Google Sheet Creation and Automation

- **Create Google Sheet**: Using the Google Sheets API, a new Google Sheet is automatically created based on the data in `sheets.json`. Users receive the link to this sheet via email.
- **Store Sheet ID**: The sheet ID is saved for future reference and polling.

### 3. Polling and Update Detection

- **Detect Changes**: Since service accounts cannot create triggers, the system uses the Google Drive API to monitor changes based on timestamps. It polls the Google Sheet every 10 seconds (interval is adjustable) to detect updates.
- **Update Sheets Data**: When a new update is detected, the latest version of the sheet is fetched, and `sheets.json` is updated.

### 4. Format Conversion and Data Synchronization

- **Convert Sheets Data to SQL Format**: The updated `sheets.json` is converted to `sql.json` using a function called `sheet2sql`. This function transforms the sheet data into a structured format suitable for MySQL.
- **Update MySQL Database**: The `sql.json` is used to automatically create or update the MySQL table with the latest data, ensuring that the database reflects the most recent changes from the Google Sheet.

### 5. Deletion Operations

- **Delete Sheet and Table**: Both the Google Sheet and the corresponding MySQL table can be deleted using API calls. The system also handles the cleanup of associated files, such as `sheetId.json`.

## MVC Architecture

The project follows the MVC (Model-View-Controller) architecture:

- **Model**: Functions that handle data and database interactions, such as querying and updating the MySQL database.
- **Controller**: Manages incoming requests, processes them (using models if needed), and returns responses. This includes handling uploaded JSON files, creating Google Sheets, and updating the MySQL database.
- **Router**: Directs incoming requests to the appropriate controller functions.
- **Server.js**: The entry point for the application that sets up the server and middleware, integrating with the MVC structure.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
