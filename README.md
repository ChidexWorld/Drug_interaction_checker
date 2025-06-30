# Precious Drug Interaction Checker

A condition-aware drug interaction checker with real-time clinical alerts designed for healthcare professionals and pharmacists.

## Features

### Core Functionality
- **Drug Interaction Checking**: Check for harmful combinations between multiple drugs
- **Severity Levels**: Major, Moderate, Minor, and Contraindicated interactions
- **Clinical Notes**: Detailed explanations for each interaction
- **Alternative Suggestions**: Safer drug alternatives for high-risk combinations

### Advanced Features
- **Condition-Aware Alerts**: Adjusts interaction severity based on patient conditions
- **Symptom-to-Condition Mapping**: Maps symptoms to possible conditions for enhanced alerts
- **Real-Time Alerts**: Color-coded flags and instant warnings
- **Brand Name Support**: Search by both generic and brand names
- **Nigerian Drug Database**: Includes locally relevant drug brands and manufacturers

## Technology Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express.js
- **Database**: SQLite for development, easily scalable to PostgreSQL/MySQL
- **Real-time Features**: WebSocket support for instant alerts

## Database Schema

### Core Tables
1. **Drug** - Master list of drugs with names, classes, brands, and manufacturers
2. **Interaction** - Base interactions between drugs with descriptions
3. **Condition** - Predefined medical conditions
4. **Condition_Interaction** - Condition-specific severity adjustments
5. **Symptom** - List of symptoms tied to conditions
6. **Condition_Symptom_Map** - Links symptoms to conditions
7. **Clinical_Note** - Explanatory notes for interactions
8. **Alternative_Drug** - Safer alternatives for flagged combinations

## Installation

1. Clone the repository
2. Install dependencies: `npm run install-all`
3. Start development server: `npm run dev`

## Usage

1. Enter two or more drugs (generic or brand names)
2. Optionally select patient condition
3. View interaction results with severity levels
4. Check suggested alternatives for high-risk combinations
5. Explore conditions and their associated symptoms

## Color Coding

- 🔴 **Contraindicated** (Level 4) - Do not use together
- 🟠 **Major** (Level 3) - Serious interaction, monitor closely
- 🟡 **Moderate** (Level 2) - Monitor for effects
- 🟢 **Minor** (Level 1) - Minimal risk

## Contributing

This system is designed to scale with additional drugs, interactions, and conditions. Contributions are welcome for expanding the database and improving functionality.
