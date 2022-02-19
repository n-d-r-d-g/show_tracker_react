import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, ErrorPage } from './pages';
import { Suspense } from 'react';

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
