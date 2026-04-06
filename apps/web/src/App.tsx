// App router
import { Route, Switch, Redirect } from "wouter";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsListPage } from "./pages/admin/ProjectsListPage";
import { NewProjectPage } from "./pages/admin/NewProjectPage";
import { EditProjectPage } from "./pages/admin/EditProjectPage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
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
          <Redirect to="/admin/projects" />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute>
          <ProjectsListPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/projects/new">
        <ProtectedRoute>
          <NewProjectPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/projects/:id/edit">
        {(params) => (
          <ProtectedRoute>
            <EditProjectPage id={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
