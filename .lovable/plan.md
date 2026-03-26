

## Changes

### 1. Replace all gradient colors with solid `#980755`
Every instance of `linear-gradient(135deg, #590432, #470328)` and hardcoded `#590432`/`#470328` references will be replaced with solid `#980755` across all files:
- `src/theme/theme.ts` — update primary/secondary palette and button overrides
- `src/components/layout/Sidebar.tsx` — logo box, active states
- `src/components/layout/Navbar.tsx` — title, avatar
- `src/pages/Dashboard.tsx` — heading, icon backgrounds
- `src/pages/Users.tsx` — heading
- `src/pages/DeepfakeVideos.tsx` — heading, upload area
- `src/pages/TutorialVideos.tsx` — heading, tabs
- `src/pages/SubscriptionPlans.tsx` — heading, badges
- `src/pages/OnboardingQuestions.tsx` — heading, hover states
- `src/pages/Login.tsx` — logo, heading, button

### 2. Add Signup page
New file `src/pages/Signup.tsx` — registration form matching the Login page style with name, email, password fields and a link to Login.

### 3. Update Login page
Add a "Don't have an account? Sign Up" link to navigate to `/signup`.

### 4. Add Logout option
Add a Logout button (with `Logout` icon) at the bottom of the Sidebar that navigates to `/login`.

### 5. Update routes
Add `/signup` route in `App.tsx` pointing to the new Signup page.

### Technical details
- 10 files modified (color replacement)
- 1 new file (`Signup.tsx`)
- All gradient `background` + `WebkitBackgroundClip` + `WebkitTextFillColor` replaced with simple `color: '#980755'`
- Theme primary.main → `#980755`, secondary.main → `#980755`
- Button style changed from gradient to solid `bgcolor: '#980755'`

