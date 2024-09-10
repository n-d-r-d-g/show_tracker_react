import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorPage, HomePage, SignInPage } from './pages';
import './App.css';

function AppRoutes() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  const { t: tCommon } = useTranslation('common');

  return (
    <BrowserRouter>
      <Suspense fallback={tCommon('loading')}>
        <AuthProvider
          signInEndpoint={`${import.meta.env.VITE_APP_API_URL}signin`}
          signOutEndpoint={`${import.meta.env.VITE_APP_API_URL}signout`}
        >
          <AppRoutes />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
