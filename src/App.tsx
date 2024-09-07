import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './composables/useAuth';
import { ErrorPage, HomePage } from './pages';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <div className="App">
          <AuthProvider
            signInEndpoint={`${process.env.REACT_APP_API_URL}signin`}
            signOutEndpoint={`${process.env.REACT_APP_API_URL}signout`}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </AuthProvider>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
