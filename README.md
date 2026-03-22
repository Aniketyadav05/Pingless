# StatusPage 🔗

> **Your work status, on one link.**  
> Share what you're working on, what's blocked, and what you shipped — on a beautiful public page your teammates can check anytime. No meetings needed.

---

## What this app does

StatusPage gives every person a personal public URL (e.g. `statuspage.app/alexjohnson`) showing their live work status. They update it from a private dashboard, and anyone — teammates, managers, stakeholders — can check it without pinging them.

**Problem it solves:** "Hey, what are you working on?" pings kill focus. StatusPage kills those pings.

---

## Tech Stack (100% free)

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | React 18 + Vite | Free |
| Routing | React Router v6 | Free |
| Auth | Firebase Authentication (Google) | Free |
| Database | Firebase Firestore | Free (Spark plan) |
| Hosting | Vercel | Free |

**Firebase Spark free limits** (more than enough for MVP):
- 50,000 Firestore reads / day
- 20,000 Firestore writes / day
- 1 GB storage
- Unlimited Google Auth sign-ins

---

## Project Structure

```
statuspage/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # App entry, routes
    ├── index.css             # Global styles + CSS variables
    ├── lib/
    │   └── firebase.js       # Firebase init — PUT YOUR KEYS HERE
    ├── hooks/
    │   └── useAuth.js        # Auth state + auto user profile creation
    └── pages/
        ├── Landing.jsx       # Public landing page + sign in
        ├── Dashboard.jsx     # Private status editor (requires login)
        └── Profile.jsx       # Public profile page /:username
```

---

## Routes

| Route | Page | Auth required |
|-------|------|--------------|
| `/` | Landing page | No |
| `/dashboard` | Status editor | Yes |
| `/:username` | Public profile | No |

---

## Firestore Data Model

### Collection: `users`
**Document ID:** Firebase Auth UID

```js
{
  uid: "firebase_uid",
  displayName: "Alex Johnson",        // from Google account
  email: "alex@acme.com",            // from Google account
  photoURL: "https://...",            // Google profile photo
  username: "alexjohnson123",         // auto-generated on first login, unique
  availability: "available",          // "available" | "focused" | "meeting" | "offline"
  today: "Refactoring auth module",   // what they're doing today
  thisWeek: "Q3 roadmap planning",    // in-progress items this week
  shipped: "Dark mode rollout",       // recently completed
  blocked: "Waiting on design review",// blockers
  role: "Senior Engineer",            // optional job title
  company: "Acme Corp",               // optional company/team
  createdAt: Timestamp,               // first login
  updatedAt: Timestamp,               // last status update
}
```

---

## Setup Guide (step by step)

### Step 1 — Clone and install

```bash
git clone https://github.com/yourname/statuspage.git
cd statuspage
npm install
```

### Step 2 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `statuspage` → disable Google Analytics (not needed)
3. Click **"Web"** (the `</>` icon) to add a web app
4. Register the app, copy the `firebaseConfig` object

### Step 3 — Add Firebase credentials

Open `src/lib/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234:web:abcdef"
}
```

### Step 4 — Enable Google Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** → set a support email → Save

### Step 5 — Enable Firestore

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll set rules next)
3. Pick a region close to your users (e.g. `asia-south1` for India)

### Step 6 — Set Firestore Security Rules

In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Anyone can READ a user profile (public pages)
      allow read: if true;

      // Only the authenticated owner can WRITE their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

### Step 7 — Run locally

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Deployment (Vercel — free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts — it auto-detects Vite
# Your app is live at: https://your-project.vercel.app
```

**For client-side routing to work on Vercel**, create a `vercel.json` file in the root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Custom Domain (optional, free on Vercel)

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. In Vercel dashboard → your project → **Domains** → add your domain
3. Follow the DNS instructions

---

## Features — MVP vs Future

### MVP (what's built)
- [x] Google sign-in
- [x] Auto-generated public username
- [x] Edit 4 status fields (today, this week, shipped, blocked)
- [x] Set availability (available / focused / meeting / offline)
- [x] Add role + company to profile
- [x] Public profile page at `/:username`
- [x] Copy link button
- [x] "Last updated X ago" on public page
- [x] Google profile photo on public page

### Ideas to build next
- [ ] Custom username (let user change it)
- [ ] Slack integration — post your status to a channel
- [ ] Team view — see all teammates' statuses on one page
- [ ] Status history — see what someone shipped last week
- [ ] Email digest — daily team status email
- [ ] Embeddable widget for Notion / Confluence
- [ ] Status expiry — auto-mark as stale after 24h
- [ ] Mobile app (React Native — same Firebase backend)

---

## Environment Variables (optional)

If you don't want to commit Firebase keys to git, use a `.env` file:

```bash
# .env.local (add this to .gitignore)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234:web:abcdef
```

Then in `src/lib/firebase.js`:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

---

## Common Issues

**"Firebase: Error (auth/unauthorized-domain)"**  
→ Go to Firebase Console → Authentication → Settings → Authorized domains → add your Vercel domain

**Public profile page gives 404 on refresh**  
→ Make sure `vercel.json` rewrites are set up (see Deployment section)

**Google login popup blocked**  
→ Only happens in dev with some browsers. Try clicking the button again or use Chrome.

**Username collision (two users get same username)**  
→ The MVP uses a random suffix (e.g. `alexjohnson847`) to avoid this. For production, add a Firestore transaction to guarantee uniqueness.

---

## Context for AI assistants

If you're picking this up in a different AI:

- This is a React + Vite + Firebase app
- Authentication is done via Firebase Auth (Google provider) in `src/hooks/useAuth.js`
- All user data lives in Firestore collection `users`, document ID = Firebase UID
- The public profile is read by querying Firestore where `username == :username` (no auth needed)
- Routing: `/` = landing, `/dashboard` = private editor, `/:username` = public profile
- Styling is all inline CSS with CSS variables defined in `src/index.css`
- No UI library is used — all components are custom
- To add a new field: add it to the Firestore document, add a textarea in `Dashboard.jsx`, display it in `Profile.jsx`

---

## License

MIT — build freely, ship fast.
