# PromptApp - Essential AI Prompt Management Dashboard

PromptApp is a modern, responsive web application designed to help you create, manage, organize, and share your best AI prompts. Built with a sleek glass-morphism design system, the app works entirely in the browser using Vanilla JavaScript and `localStorage`, meaning it's blazing fast, fully portable, and requires zero back-end setup to get started!

## 🚀 Features

- **🔐 Local Authentication Simulation**
  - Sign up, log in, and secure your session purely dynamically utilizing frontend-only logic.
- **🎨 Premium Dark & Light Mode**
  - Fully responsive, beautiful UI toggling smoothly between dark and light themes dynamically adjusting background gradients, shadows, borders, and charts.
- **📱 Responsive Sidebar Dashboard System**
  - Collapsible sidebar for smaller screens, full dashboard architecture featuring central routing to My Prompts, Public Prompts, Categories, Analytics, and Settings.
- **📝 Comprehensive Prompts CRUD**
  - Features for creating, saving, fetching, editing, copying to clipboard, and deleting prompts. 
  - Apply custom tags, define categories, and toggle prompts as `Private` or `Public`.
- **🗂 Category Management**
  - Manage all organizational categories directly within the app. Create new categories, or seamlessly delete them (defaults prompts safely back to an Uncategorized state).
- **📊 Real-time Chart.js Analytics**
  - Live analytics visualization (Pie and Bar charts) adapting to Theme colors representing prompt density based on privacy toggles and top categories used.
- **📃 Pagination & Live Search Filtering**
  - Effortlessly sort through vast Prompt libraries (Public or Private) with live search text matching, category drop-down filters, and built-in numerical pagination systems.
- **🍞 Custom Toast Notifications**
  - Sleek visual toast UI notifications upon success operations like "Copied to Clipboard" or error states.

## 📁 Project Structure

```
WDT.Project/
│
├── css/
│   ├── style.css             # Main styling, Themes, Dashboard layouts
│   └── landing.css           # Styling specific for public-facing home pages
├── js/
│   ├── data/prompts.js       # Core storage initialization arrays 
│   ├── main.js               # Global UI scripts (Themes, Sidebar, Navigation)
│   └── toast.js              # Global Notification Controller
│
├── pages/
│   ├── auth/                 # Sign-in and Registration views
│   ├── prompts/              # Central Prompt manipulation hubs
│   ├── categories/           # Category CRUD hub
│   ├── public/               # Public exploration hubs
│   └── settings/             # Settings and App configurations
│
├── index.html                # The hero landing page 
└── README.md                 # Project Overview 
```

## 🛠 Tech Stack

1. **HTML5**: Structured semantically.
2. **Vanilla CSS3**: Leverages native CSS variables (`:root`) for extensive theming and system fluidity without relying on hefty external frameworks.
3. **Vanilla JS**: Entire application logic functioning cleanly via the DOM structure.
4. **LocalStorage**: Acts as our "Database" to store Arrays of user context (Categories, Active Users, Prompts context).
5. **Chart.js (CDN)**: Handles the rich dashboard graphical rendering on the analytics page.

## 🏁 Getting Started

Since the project operates entirely via the browser, there is no `node_modules` installation or build pipelines currently required!

1. Clone or download the repository to your local machine.
2. To use it, simply double-click the `index.html` file or setup any minimal local development server (like VSCode's *Live Server* extension).
3. **Create an account** via the "Get Started" prompt button, and start writing amazing prompts instantly!
