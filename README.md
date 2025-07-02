# Precious Drug Interaction Checker

A modern, full-stack, condition-aware drug interaction checker with real-time clinical alerts, beautiful responsive UI, and a robust MySQL backend. Designed for healthcare professionals and pharmacists in Nigeria and beyond.

## ✨ Features

### Core Functionality

- **Drug Interaction Checking**: Instantly check for harmful combinations between multiple drugs
- **Severity Levels**: Contraindicated, Major, Moderate, and Minor interactions (color-coded)
- **Condition-Aware Alerts**: Severity adjusts based on selected patient condition
- **Alternative Suggestions**: Safer drug alternatives for high-risk combinations
- **Clinical Notes**: Detailed explanations and recommendations for each interaction
- **Brand Name Support**: Search by both generic and brand names
- **Nigerian Drug Database**: Includes local brands and manufacturers

### Advanced Features

- **Symptom-to-Condition Mapping**: Map symptoms to possible conditions for enhanced alerts
- **Real-Time Alerts**: Color-coded flags and instant warnings
- **Modern Responsive UI**: Beautiful, glassmorphic, mobile-first design with Tailwind CSS
- **Comprehensive Error Handling**: Robust feedback for all user actions
- **Pagination & Search**: Fast, paginated drug database with search and filters

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite, TypeScript, Tailwind CSS, Lucide Icons, React Toastify)
- **Backend**: Node.js (Express.js, robust REST API)
- **Database**: MySQL (production), SQLite (for demo/testing)
- **Real-time Features**: WebSocket-ready for instant alerts

## 🗄️ Database Schema (MySQL)

1. **Drug** - Master list of drugs (id, generic_name, drug_class, brands, manufacturer, description)
2. **Interaction** - Drug-drug interactions (drug1_id, drug2_id, severity, description, clinical_note)
3. **Condition** - Medical conditions (id, name, description, severity_level)
4. **Condition_Interaction** - Condition-specific severity adjustments (condition_id, drug1_id, drug2_id, severity)
5. **Symptom** - Symptoms (id, name, description)
6. **Condition_Symptom_Map** - Links symptoms to conditions (condition_id, symptom_id)
7. **Alternative_Drug** - Safer alternatives (interaction_id, alternative_drug_id)

git clone https://github.com/ChidexWorld/Drug_interaction_checker.git

## 🚀 Installation & Local Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ChidexWorld/Drug_interaction_checker.git
cd Drug_interaction_checker

# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

### Manual Setup

```bash
# Install root dependencies
npm install

# Setup backend (MySQL)
cd server
npm install
node scripts/initDatabase.js
node scripts/seedDatabase.js
node scripts/seedInteractions.js

# Setup frontend
cd ../client
npm install

# Start servers (in separate terminals)
cd ../server && npm run dev     # Backend on :5000
cd ../client && npm run dev     # Frontend on :3000
```

### Quick Demo (No Dependencies)

```bash
# Start simple server
cd server
node simple-server.js

# Open demo.html in browser or visit the file directly
```

## 💡 Usage

1. Enter two or more drugs (generic or brand names)
2. Optionally select a patient condition for personalized alerts
3. View interaction results with color-coded severity levels
4. Check suggested alternatives for high-risk combinations
5. Explore all drugs, conditions, and their associated symptoms

### Color Coding

- 🔴 **Contraindicated** (Level 4) - Do not use together
- 🟠 **Major** (Level 3) - Serious interaction, monitor closely
- 🟡 **Moderate** (Level 2) - Monitor for effects
- 🟢 **Minor** (Level 1) - Minimal risk

## 🖌️ UI/UX Highlights

- Modern, glassmorphic, and gradient-based design
- Fully responsive and mobile-friendly
- Accessible, color-blind friendly, and easy to use
- Beautiful cards, tabs, and navigation
- Loading, empty, and error states are visually appealing

## 🤝 Contributing

This system is designed to scale with additional drugs, interactions, and conditions. Contributions are welcome for expanding the database, improving UI/UX, and adding new features.

## 📦 Project Structure

See `DEPLOYMENT.md` for a full breakdown of the project structure, environment variables, and deployment instructions.

## 🛠️ Troubleshooting & Support

### Common Issues

1. **Port conflicts**: Change ports in package.json scripts
2. **Database errors**: Use simple-server.js for quick testing
3. **CORS issues**: Check CLIENT_URL in server/.env
4. **Build failures**: Run `npm install --force` if needed

### Support

- Check the README.md and DEPLOYMENT.md for detailed setup instructions
- Review the demo.html for working examples
- Test API endpoints using the simple-server.js

---

## 📞 Contact

For deployment assistance or technical questions, refer to the project documentation or create an issue in the GitHub repository.
