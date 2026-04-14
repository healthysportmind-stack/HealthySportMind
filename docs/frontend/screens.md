## App routing structure

The app uses `expo-router`, so each file in `frontend/app` becomes a screen route:
- `app/index.js` → `/`
- `app/register.js` → `/register`
- `app/dashboard.js` → `/dashboard`
- `app/checkin.js` → `/checkin`
- `app/settings.js` → `/settings`
- `app/performance-tracker.js` → `/performance-tracker`
- `app/LongTermInsights.js` → `/LongTermInsights`
- `app/modal.tsx` → `/modal`

## Root layout

### `app/_layout.tsx`
- Wraps the app in React Navigation theme provider
- Chooses dark or light theme based on `useColorScheme`
- Registers the main stack and a modal screen
- Renders global toast notifications

## Login screen

### `app/index.js`
- Route: `/`
- Purpose: authenticate users and navigate into the app
- Inputs:
  - `Email`
  - `Password`
- Actions:
  - `Login` sends credentials to `loginUser()`
  - stores `accessToken`, `refreshToken`, `profile`, and `user` in `AsyncStorage`
  - redirects to `/dashboard`
  - `Need an account? Sign Up` navigates to `/register`

## Registration screen

### `app/register.js`
- Route: `/register`
- Purpose: create a new user account
- Inputs:
  - `Name`
  - `Email`
  - `Password`
  - `Confirm Password`
- Actions:
  - validates required fields and password match
  - calls `registerUser()`
  - shows success message and redirects to `/` after registration
  - `Already have an account? Login` returns to `/`

## Dashboard screen

### `app/dashboard.js`
- Route: `/dashboard`
- Purpose: main home screen after login
- Data loaded:
  - today’s check-in via `getTodayCheckIn()`
  - most recent check-in via `getLastCheckIn()`
  - user profile via `getProfile()`
  - performance logs via `getPerformanceLogs()`
  - RSS articles via `fetchRSS()`
- UI features:
  - welcome header and profile info
  - quick action to complete today’s check-in
  - summary of last check-in values
  - performance tracker navigation
  - long-term insights navigation
  - mood/performance chart using `BarChart`
  - helpful articles from RSS feed
- Navigation:
  - `Settings` button → `/settings`
  - `Log Out` clears token and returns to `/`
  - `Complete today’s check-in` → `/checkin`
  - `Log Performance` → `/performance-tracker`
  - `Open Insights` → `/LongTermInsights`

## Daily check-in screen

### `app/checkin.js`
- Route: `/checkin`
- Purpose: submit daily check-in data
- Inputs:
  - `Mood` slider (1–10)
  - `Stress` slider (1–10)
  - `Energy` slider (1–10)
  - `Sleep Hours` text field
  - `Notes` multiline text field
- Actions:
  - `Submit Check-In` sends payload to `submitCheckIn()`
  - shows success or error toast
  - redirects to `/dashboard` after success

## Settings screen

### `app/settings.js`
- Route: `/settings`
- Purpose: update profile preferences and notification settings
- Inputs:
  - `Name`
  - `Sport`
  - preferred tone selection (`neutral`, `coach`, `calm`, `direct`, `supportive`)
  - `Weekly Summary` toggle
  - `Monthly Summary` toggle
- Actions:
  - saves preferences to local storage
  - patches profile data at `/api/profile/update/`
  - shows toast confirmation on success
  - `Log Out` clears token and returns to `/`

## Performance tracker screen

### `app/performance-tracker.js`
- Route: `/performance-tracker`
- Purpose: log mood and performance observations
- Inputs:
  - up to 3 selected moods from a predefined mood list
  - performance rating slider (1–100)
  - comments text field
- Actions:
  - `Submit Log` sends the performance payload to `submitPerformanceLog()`
  - navigates back to `/dashboard` on success

## Long-term insights screen

### `app/LongTermInsights.js`
- Route: `/LongTermInsights`
- Purpose: display saved weekly and monthly long-term insight feedback
- Behavior:
  - loads `accessToken` from `AsyncStorage`
  - fetches long-term feedback from `/api/checkins/insights/long-term/`
  - toggles between `weekly` and `monthly` modes
  - renders message cards with `created_at`, `message`, and `category`

## Modal screen

### `app/modal.tsx`
- Route: `/modal`
- Purpose: simple modal route available via the stack navigator
- Behavior:
  - displays a title and a link back to home
