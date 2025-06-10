# 🎮 Cinalog

**Cinalog** is a personal movie and TV show tracker that allows users to log what they’ve watched, leave reviews, rate content with a 5-star system, and manage a personalized watchlist — all within a sleek, dark-themed React web app.

---

## 🚀 Features

* 🔍 Search for movies and TV shows using the TMDB API
* ⭐ Rate content on a 5-star scale
* 📝 Write and save reviews
* 📃 Add titles to a custom watchlist
* 👤 User authentication with Firebase
* 🌃 Fully responsive UI with a dark-mode design

---

## 🔧 Technologies Used

* **React**
* **Firebase Authentication & Firestore**
* **react-router-dom** for routing
* **react-icons** for UI icons
* **TMDB API** for movie and TV data

---

## 📦 Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/yourusername/cinalog.git
   cd cinalog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   npm i react-icons firebase react-router-dom
   ```

3. **Set up Firebase:**

   * Go to [Firebase Console](https://console.firebase.google.com/)
   * Create a new project
   * Enable **Authentication (Email/Password)** and **Firestore Database**
   * Copy your Firebase config and create a `.env` file:

     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Set up TMDB API:**

   * Sign up at [https://www.themoviedb.org/](https://www.themoviedb.org/) and get your API key
   * Add to your `.env` file:

     ```
     VITE_TMDB_API_KEY=your_tmdb_api_key
     ```

5. **Run the app:**

   ```bash
   npm run dev
   ```

---

## 📁 Folder Structure

```
/src
  /components
  /pages
  /firebase
  /styles
  App.jsx
  main.jsx
.env
```

---

## ✨ Future Improvements

* Add social features (friend lists, activity feeds)
* Implement list sharing and exporting
* Add analytics/dashboard (monthly recaps, genre stats)

---

## 📸 Demo

![Cinalog Final](https://github.com/user-attachments/assets/42e1973d-29c2-46e4-8caa-ab23ce6ef31b)


---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
