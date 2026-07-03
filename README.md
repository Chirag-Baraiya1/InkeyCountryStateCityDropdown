# 🌍 Country State City Dropdown PCF Control

A custom Power Apps Component Framework (PCF) control that provides cascading **Country**, **State**, and **City** dropdowns for Microsoft Power Apps and Dynamics 365.

## Features

* Cascading Country → State → City selection
* Automatic filtering based on parent selection
* Easy to configure
* Responsive and user-friendly interface
* Built with TypeScript and Power Apps Component Framework (PCF)

---

## Requirements

* Microsoft Power Apps
* Microsoft Dataverse
* Power Apps CLI
* Node.js

---

## Configuration

Configure the following input properties while adding the control to a field:

| Property | Description                                     |
| -------- | ----------------------------------------------- |
| Country  | Column containing Country values                |
| State    | Column containing State values                  |
| City     | Column containing City values                   |
| Mode     | Defines how the control behaves (if applicable) |

After configuration:

1. Select a **Country**.
2. The **State** dropdown is automatically filtered.
3. Select a **State**.
4. The **City** dropdown is automatically filtered.

---

## Build

Install dependencies:

```bash
npm install
```

Build the control:

```bash
npm run build
```

Run in the test harness:

```bash
npm start
```

---

## Usage

1. Import the PCF solution into your Power Platform environment.
2. Add the control to the required column on a form.
3. Configure the input properties.
4. Save and publish the customizations.
5. Open the form and start using the cascading Country, State, and City dropdowns.

---

## Technologies

* Power Apps Component Framework (PCF)
* TypeScript
* Microsoft Dataverse
* Node.js

---

## Author

**Chirag Baraiya**
