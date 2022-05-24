import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { FetchProvider } from './contexts/FetchContext';
import Dashboard from './components/Dashboard/Dashboard'
import ResponsiveAppBar from './components/AppBar/ResponsiveAppBar';
import NotLoggedYet from './components/Login/NotLoggedYet';
import SearchPage from './pages/SearchPage';
import { SearchProvider } from './contexts/SearchContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ExerciseDetailsPage from './pages/ExerciseDetailsPage';
import RecorderPage from './pages/RecorderPage';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import { isLogged } from './store/reducers/authReducer';

function App() {
  const AutheticatedRoute = ({ children }) => {
    const isLoggedIn = useSelector(isLogged);
    return isLoggedIn ? children : <NotLoggedYet />;
  }

  const AppRoutes = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={
            <HomePage/>
          } />
          <Route path="/record/*" element={
            <AutheticatedRoute>
              <RecorderPage />
            </AutheticatedRoute>
          } />
          <Route path="/profile/:userId" element={
            <AutheticatedRoute>
              <ProfilePage />
            </AutheticatedRoute>
          } />
          <Route path="/login" element={
            <LoginPage />
          } />
          <Route path="/signup" element={
            <SignupPage />
          } />
          <Route path="/dashboard" element={
            <AutheticatedRoute>
              <Dashboard />
            </AutheticatedRoute>
          } />
          <Route path="/exercise/:publicationId" element={
            <AutheticatedRoute>
              <ExerciseDetailsPage />
            </AutheticatedRoute>
          } />
          <Route path="/search" element={
            <AutheticatedRoute>
              <SearchProvider>
                <SearchPage />
              </SearchProvider>
            </AutheticatedRoute>
          } />
        </Routes>
      </>
    )
  }

  return (
    <Router>
        <FetchProvider>
          <ResponsiveAppBar />
          <AppRoutes />
        </FetchProvider>
    </Router>
  );
}

export default App;
