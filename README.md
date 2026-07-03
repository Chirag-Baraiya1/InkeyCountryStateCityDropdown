# 🌍 Country State City Dropdown PCF Control

A Power Apps Component Framework (PCF) control that provides cascading Country, State, and City dropdowns for Microsoft Power Platform and Dynamics 365.

## ✨ Features

- 🌎 Cascading Country → State → City selection
- ⚡ Fast and responsive UI
- 🎨 Modern dropdown interface
- 🔧 Easy configuration
- 💻 Built using TypeScript and Power Apps Component Framework
- 🔄 Automatic filtering of State and City based on selected values

---

## Requirements

- Power Apps
- Microsoft Dataverse
- Power Apps CLI
- Node.js
- PCF Development Environment

---

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/<repository-name>.git
```

Navigate to the project:

```bash
cd <repository-name>
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Run the project:

```bash
npm start
```

---

## Configuration

Add the PCF control to your Power Apps or Dynamics 365 form.

Configure the required parameters:

- Country
- State
- City

The control automatically filters the available State values based on the selected Country and filters the City values based on the selected State.

---

## Technologies Used

- Power Apps Component Framework (PCF)
- TypeScript
- Microsoft Dataverse
- Node.js

---

## Project Structure

```
src/
│
├── index.ts
├── ControlManifest.Input.xml
├── css/
├── resources/
└── generated/
```

---

## Future Enhancements

- Searchable dropdowns
- Multi-language support
- Custom styling options
- Additional validation
- Performance improvements

---

## Contributing

Contributions are welcome.

Please fork the repository, create a feature branch, and submit a pull request.


## License

No license has been specified for this repository.

Power Platform Developer
