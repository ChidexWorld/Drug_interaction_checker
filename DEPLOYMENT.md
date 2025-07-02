# Precious Drug Interaction Checker - Deployment Guide

## 🚀 GitHub Repository Setup

### Prerequisites

- GitHub account with access to the repository
- Git installed on your system
- Node.js (v18+ recommended)

### Step 1: Authentication Setup

Choose one of these authentication methods:

#### Option A: Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token when prompted for password during push

#### Option B: SSH Key

1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys
3. Change remote URL: `git remote set-url origin git@github.com:ChidexWorld/Drug_interaction_checker.git`

#### Option C: GitHub CLI

1. Install GitHub CLI: `gh auth login`
2. Follow the authentication flow

### Step 2: Push to Repository

```bash
# Navigate to project directory
cd /path/to/Precious

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

### Step 3: Repository Structure

```
Drug_interaction_checker/
├── README.md                          # Project overview and setup
├── DEPLOYMENT.md                      # This deployment guide
├── package.json                       # Root package configuration
├── .gitignore                         # Git ignore rules
├── demo.html                          # Live demo interface
├── start.sh / start.bat               # Setup scripts
│
├── server/                            # Backend API
│   ├── package.json                   # Server dependencies
│   ├── index.js                       # Main Express server
│   ├── simple-server.js               # Lightweight demo server
│   ├── database/
│   │   ├── schema.sql                 # Database schema (MySQL compatible)
│   │   ├── connection.js              # Database connection (MySQL)
│   │   └── mockData.js                # Mock data for testing
│   ├── routes/                        # API endpoints
│   │   ├── drugs.js                   # Drug-related endpoints
│   │   ├── interactions.js            # Interaction checking
│   │   ├── conditions.js              # Medical conditions
│   │   └── symptoms.js                # Symptoms management
│   └── scripts/                       # Database utilities
│       ├── initDatabase.js            # Initialize database
│       ├── seedDatabase.js            # Seed basic data
│       └── seedInteractions.js        # Seed interaction data
│
├── client/                            # Frontend React app
│   ├── package.json                   # Client dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── src/
│   │   ├── App.tsx                    # Main application
│   │   ├── main.tsx                   # Entry point
│   │   ├── index.css                  # Global styles
│   │   ├── components/                # React components
│   │   │   ├── Header.tsx             # Navigation header (modern, responsive)
│   │   │   ├── DrugInteractionChecker.tsx  # Main checker (modern, responsive)
│   │   │   ├── DrugSelect.tsx         # Drug selection (modern, responsive)
│   │   │   ├── ConditionSelect.tsx    # Condition selection (modern, responsive)
│   │   │   ├── InteractionResults.tsx # Results display (modern, responsive)
│   │   │   ├── DrugDatabase.tsx       # Drug browser (modern, responsive)
│   │   │   └── ConditionsSymptoms.tsx # Conditions browser (modern, responsive)
│   │   ├── services/
│   │   │   └── api.ts                 # API service layer
│   │   └── types/
│   │       └── index.ts               # TypeScript definitions
│   └── public/                        # Static assets
│
└── docs/                              # Original project documents
    ├── Developer brief.docx
    ├── PROJECT DATABASE 3.xlsx
    ├── Revised….docx
    └── project-1.docx
```

## 🛠️ Local Development Setup

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ChidexWorld/Drug_interaction_checker.git
cd Drug_interaction_checker

# Install dependencies
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

# Open demo.html in browser
# Visit: file:///path/to/demo.html
```

## 🌐 Production Deployment

### Environment Variables

Create `.env` files:

**server/.env**

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=precious_db
```

**client/.env**

```
VITE_API_URL=https://your-backend-domain.com/api
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Hosting Options

- **Backend**: Heroku, Railway, DigitalOcean, AWS, Render
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MySQL (production), SQLite (for quick demo/testing)

## 📋 Features Included

### ✅ Core Functionality

- [x] Drug interaction checking
- [x] Condition-aware severity adjustments
- [x] Real-time clinical alerts
- [x] Alternative drug suggestions
- [x] Nigerian drug database
- [x] Symptom-to-condition mapping

### ✅ Technical Features

- [x] RESTful API with comprehensive endpoints
- [x] Modern React frontend with TypeScript
- [x] Responsive design with Tailwind CSS
- [x] SQLite database with full schema
- [x] Mock data fallback for testing
- [x] Comprehensive error handling
- [x] API documentation and testing

### ✅ User Interface

- [x] Interactive drug search with autocomplete
- [x] Condition selection for personalized alerts
- [x] Color-coded severity levels
- [x] Clinical notes and recommendations
- [x] Alternative drug suggestions
- [x] Mobile-responsive design

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in package.json scripts
2. **Database errors**: Use simple-server.js for quick testing
3. **CORS issues**: Check CLIENT_URL in server/.env
4. **Build failures**: Run `npm install --force` if needed

### Support

- Check the README.md for detailed setup instructions
- Review the demo.html for working examples
- Test API endpoints using the simple-server.js

## 📞 Contact

For deployment assistance or technical questions, refer to the project documentation or create an issue in the GitHub repository.
