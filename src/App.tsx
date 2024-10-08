import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorPage, ShowsPage, SignInPage } from './pages';

function AppRoutes() {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <ShowsPage /> : <SignInPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  const { t: tCommon } = useTranslation('common');

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Suspense fallback={tCommon('loading')}>
          <AuthProvider
            signInEndpoint={`${import.meta.env.VITE_APP_API_URL}${
              import.meta.env.VITE_SIGN_IN_ENDPOINT
            }`}
            signOutEndpoint={`${import.meta.env.VITE_APP_API_URL}${
              import.meta.env.VITE_SIGN_OUT_ENDPOINT
            }`}
            signOutAllEndpoint={`${import.meta.env.VITE_APP_API_URL}${
              import.meta.env.VITE_SIGN_OUT_ALL_ENDPOINT
            }`}
            refreshEndpoint={`${import.meta.env.VITE_APP_API_URL}${
              import.meta.env.VITE_REFRESH_ENDPOINT
            }`}
          >
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
