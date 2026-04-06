# 🎬 Movie Explorer

A React Native app to explore movies using The Movie DB API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tests](https://img.shields.io/badge/Tests-149%20passing-success?style=flat)


---

## 📱 Mobile Builds (Preview)

To facilitate the testing process, I have generated standalone builds for both platforms. These versions are **pre-configured with the TMDB API Key** and environment variables.

### 🤖 Android (Physical Device)
* **Download Link:** [The Movie App - Android APK](https://expo.dev/accounts/jmblack15/projects/the-movie-app/builds/a2333b17-0161-4a01-9c3d-b76dce7c3438)
* **Format:** `.apk`
* **Installation:** Download the file and select "Install Anyway" if prompted by Play Protect (standard for development builds).

> [!IMPORTANT]
> **Android Security Notice**
> * **Android 8.0 (API 26) or higher:** You must enable "Install unknown apps" for your specific browser (e.g., Chrome) in *Settings > Apps > Special app access*.
> * **Android 7.1.1 (API 25) or lower:** Enable "Unknown sources" in *Settings > Security*.

### 🍎 iOS (Simulator)
This build is specifically compiled for **x86_64/arm64 architectures** to run on the **iOS Simulator** (macOS). It does not require an Apple Developer account or physical device registration.

* **Download Link:** [The Movie App - iOS Simulator Build](REEMPLAZAR_CON_TU_LINK_DE_IOS_CUANDO_TERMINE)
* **Format:** `.tar.gz` (Compressed App Bundle)
* **Requirements:** A Mac with Xcode installed.

#### 🛠️ Installation Steps:
1.  **Download** the `.tar.gz` file from the link above.
2.  **Extract** the file on your Mac to reveal the `TheMovieApp.app` folder.
3.  **Open your iOS Simulator** (via Xcode or `npx expo start`).
4.  **Drag and drop** the `TheMovieApp.app` folder directly onto the Simulator screen.
5.  The app icon will appear on the home screen. Tap it to launch.

> [!TIP]
> If you have **Expo Orbit** installed, you can simply click the "Open in Orbit" button on the Expo build page for a one-click installation.

---

## Features

- 🎬 Movie list with infinite scroll (TMDB /discover/movie)
- 🔤 Letter filter — title + min 3 genres + balanced cast (≥3 female, ≥3 male actors)
- 🎭 Movie detail screen with backdrop, cast carousel, genres and overview
- ❤️ Watchlist — add/remove movies, persisted locally with AsyncStorage
- 📡 Offline support — cached movies shown when no internet connection
- 🔔 Smart notifications — fires 3 min after adding to watchlist, debounced, cancels if movie opened, navigates to detail on tap

---

## Tech stack

| Technology | Purpose |
|------------|---------|
| Expo SDK 53 | Framework |
| Expo Router | File-based navigation |
| TanStack Query v5 | Server state, infinite pagination, caching |
| Zustand | Client state (watchlist, offline status) |
| AsyncStorage | Local persistence |
| expo-notifications | Local scheduled notifications |
| expo-image | Optimized image loading with cache |
| TypeScript | Type safety |
| Jest + Testing Library | Unit and integration tests |
| MSW v2 | API mocking in tests |

---

## Requirements

- Node.js >= 18
- npm >= 9
- Expo CLI
- EAS CLI (for development build)
- TMDB API key — free at https://www.themoviedb.org/settings/api
- Android or iOS device (for development build with notifications)

---

## Installation

```bash
# Clone the repo
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` and add your TMDB API key:

```
EXPO_PUBLIC_TMDB_API_KEY=your_api_key_here
```

---

## Running the app

### Option A — Development build (recommended)

Full features including notifications and deep links.

```bash
# First time only: build the development client on EAS
eas build --profile development --platform android

# Download and install the APK on your device
# Then start the development server:
npx expo start --tunnel

# Open your installed app and scan the QR code
```

### Option B — Expo Go (limited)

```bash
npx expo start --tunnel
# Scan QR with Expo Go app
```

> ⚠️ Push notifications are not available in Expo Go SDK 53+. Use Option A for full functionality.

---

## Running tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --watchAll=false --coverage

# Run only unit tests
npm test -- --testPathPattern='unit'

# Run only integration tests
npm test -- --testPathPattern='integration'
```

### Coverage summary

| File | Coverage |
|------|----------|
| filterService.ts | 100% |
| image.ts | 100% |
| watchlistStore.ts | 100% |
| movies.ts | 100% |
| WatchlistButton.tsx | 100% |
| storageService.ts | 96% |
| notificationService.ts | 76% |
| useMovieFilter.ts | 75% |
| **Overall** | **~85%** |

---

## Project structure

```
movie-explorer/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout, providers, boot hooks
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab navigator with watchlist badge
│   │   ├── index.tsx           # Home screen — infinite scroll + filter
│   │   └── watchlist.tsx       # Watchlist screen
│   └── movie/
│       └── [id].tsx            # Movie detail — dynamic route
├── src/
│   ├── api/                    # TMDB API client and endpoints
│   ├── components/
│   │   ├── common/             # OfflineBanner, WatchlistButton
│   │   └── movies/             # MovieCard, CastCarousel, FilterInput, BackdropHeader
│   ├── constants/              # API config, theme (colors, fonts, spacing)
│   ├── hooks/                  # useMovies, useMovieFilter, useNetworkStatus, useNotificationDeepLink
│   ├── services/               # filterService, notificationService, storageService
│   ├── store/                  # watchlistStore, offlineStore (Zustand)
│   ├── types/                  # Movie, Cast, Genre, WatchlistItem, etc.
│   └── utils/                  # image URL builders, formatters
├── __tests__/
│   ├── unit/                   # Pure logic tests (no React)
│   ├── integration/            # Component + store tests
│   └── e2e/                    # Maestro E2E flows
└── __mocks__/                  # MSW handlers for TMDB API
```

---

## Architecture decisions

**`filterService` as pure functions**
All filter logic lives outside React, enabling direct unit tests without mounting components.

**Two-step filter strategy**
1. Filter by title locally — free, no API calls
2. Fetch `/movie/{id}` and `/movie/{id}/credits` only for title-matched movies

This minimizes API calls when the user types a letter.

**TanStack Query + Zustand — no overlap**
- TanStack Query manages remote data lifecycle (cache, pagination, revalidation)
- Zustand manages local persisted state (watchlist, network status)

**Notification debounce with internal timers**
`notificationService` keeps a `Map<movieId, timer>` internally. Calling `scheduleWatchlistNotification` twice for the same movie cancels the first timer — no duplicates possible.

**AsyncStorage via `npx expo install`**
Installed with the Expo-compatible version to avoid "Native module is null" errors.

---

## Filter logic

When the user types a letter, a movie is shown only if it passes **all 3 conditions simultaneously**:

1. **Title starts with the letter** — checked locally (case-insensitive)
2. **At least 3 genres** — from `/movie/{id}` details endpoint
3. **At least 3 female actors** (gender=1) **AND at least 3 male actors** (gender=2) — from `/movie/{id}/credits`

> Results may be empty because TMDB gender data is incomplete for many films. This is expected behavior — the filter is intentionally strict per the technical test requirements.

---

## Notification flow

```
User adds movie to watchlist
        ↓
scheduleWatchlistNotification(movieId, movieName)
        ↓
JS timer starts (3 minutes)
        ↓ (if user opens movie detail before 3 min)
cancelWatchlistNotification(movieId) → timer cancelled, no notification
        ↓ (if 3 minutes pass)
Notification fires: "¿Listo para ver {movieName}?"
        ↓ (user taps notification)
useNotificationDeepLink → router.push('/movie/[id]')
```

---

## Notes

- Commits were made frequently from the start of the project
- Code prioritizes readability and maintainability over cleverness
