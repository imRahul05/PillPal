
 ![PillPal](public/logo.png) #  PillPal: Medication Management Made Simple


## Overview

PillPal is a comprehensive medication management application designed to help users track their medications, receive timely reminders, and maintain better medication adherence. With an intuitive interface and powerful features, PillPal makes it easy to never miss a dose again.

## 🌟 Core Features

### Medication Tracking
- **Add & Manage Medications**: Easily add and track all your prescriptions in one place
- **Dosage Schedule**: Set up custom medication schedules with specific times and frequencies
- **Categorization**: Organize medications by category (Blood Pressure, Diabetes, etc.)

### Adherence Monitoring
- **Medication Status**: Mark medications as taken or missed
- **Adherence Statistics**: Track your medication adherence rate over time
- **Daily Progress**: See at-a-glance summaries of medications taken and missed

### Prescription Management
- **Renewal Reminders**: Get notified when prescriptions need to be renewed
- **Prescription History**: Keep track of your prescription history
- **Refill Tracking**: Monitor when you need refills

### Personalized Dashboard
- **Quick Stats**: View your medication adherence rate and active medications count
- **Today's Schedule**: See what medications need to be taken today
- **Upcoming Renewals**: Get alerts for prescriptions that need to be renewed soon

### User Profiles
- **Secure Authentication**: Secure login using Firebase Authentication
- **Profile Management**: Update personal information and preferences
- **Data Privacy**: Your health information stays private and secure

## 📱 Application Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with app introduction and features | Public |
| `/login` | User login screen | Public |
| `/signup` | New user registration | Public |
| `/forgot-password` | Password recovery | Public |
| `/dashboard` | Main user dashboard with medication overview and stats | Protected |
| `/medications` | Complete list of user medications with management options | Protected |
| `/profile` | User profile management | Protected |
| `/reports` | Detailed medication adherence and usage reports | Protected |
| `/not-found` | 404 error page | Public |

## 🛡️ Authentication

PillPal uses Firebase Authentication to provide secure user access:
- Email/password authentication
- Secure protected routes for authenticated users
- Session management

## 🏗️ Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React contexts for state management
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configuration
├── pages/           # Main application pages
```

## 💻 Technology Stack

PillPal is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API and React Query
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Authentication


## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/imRahul05/PillPal.git

# Step 2: Navigate to the project directory
cd PillPal

# Step 3: Install dependencies
npm i

#step 4: Add the firebase API Keys in .env 
apiKey: FIREBASE_API_KEY,
authDomain: FIREBASE_AUTH_DOMAIN,
databaseURL: FIREBASE_DATABASE_URL,
projectId:FIREBASE_PROJECT_ID,
storageBucket:FIREBASE_STORAGE_BUCKET,
messagingSenderId:FIREBASE_MESSAGING_SENDER_ID,
appId: FIREBASE_APP_ID,
measurementId:FIREBASE_MEASUREMENT_ID

# Step 4: Start the development server
npm run dev
```

## 📚 User Flow

1. **New User**:
   - Visit the landing page
   - Click "Get Started"
   - Create a new account on the signup page
   - Set up profile information
   - Add medications to start tracking

2. **Returning User**:
   - Log in with email and password
   - View dashboard with medication overview
   - Mark medications as taken
   - Manage medication list as needed
   - View adherence reports for insights



## 👥 Contributors

Developed with ❤️ by the Rahul.

---

For support or questions, please contact rahulkumar20000516@gmail.com