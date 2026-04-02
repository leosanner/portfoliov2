// App router
import { Route, Switch } from "wouter";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/projects/:slug">
        {(params) => <ProjectPage slug={params.slug} />}
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
