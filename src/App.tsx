import React from "react";
import { Component, ErrorInfo, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { store } from "./store/store";
import { queryClient } from "./lib/queryClient";
import { theme } from "./theme/theme";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";

// Components
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import DashboardPage from "./pages/DashboardPage";
import LivestockPage from "./pages/LivestockPage";
import HealthRecordsPage from "./pages/HealthRecordsPage";
import AMUMonitoringPage from "./pages/AMUMonitoringPage";
import FeedManagementPage from "./pages/FeedManagementPage";
import YieldTrackingPage from "./pages/YieldTrackingPage";
import ProfilePage from "./pages/ProfilePage";
import DrugsListPage from "./pages/DrugsListPage";
import DrugFormPage from "./pages/DrugFormPage";
import FeedsListPage from "./pages/FeedsListPage";
import FeedFormPage from "./pages/FeedFormPage";
import AMUInsightsPage from "./pages/AMUInsightsPage";
import FeedInsightsPage from "./pages/FeedInsightsPage";
import YieldInsightsPage from "./pages/YieldInsightsPage";

import "./styles/globals.css";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <ErrorBoundary>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegistrationPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DashboardPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/livestock"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <LivestockPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/health-records"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <HealthRecordsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/amu-monitoring"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <AMUMonitoringPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/feed-management"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <FeedManagementPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/yield-tracking"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <YieldTrackingPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Catalog and Insights */}
                  <Route
                    path="/drugs"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DrugsListPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/drugs/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DrugFormPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/feeds"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <FeedsListPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/feeds/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <FeedFormPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/insights/amu"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <AMUInsightsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/insights/feed"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <FeedInsightsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/insights/yield"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <YieldInsightsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Redirect unknown routes to dashboard */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </ErrorBoundary>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
