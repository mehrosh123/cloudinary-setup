import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// Data Provider Import
import dataProvider from "@refinedev/simple-rest"; 

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/Dashboard";
import { Home, GraduationCap } from "lucide-react"; 
import { ThemedLayout } from "@refinedev/antd";

// --- CLASSES IMPORTS ---
import ClassesList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";

// Hardcoded API URL
const API_URL = "http://localhost:8000/api";

function App() {
  const baseDataProvider = dataProvider(API_URL);

  const myDataProvider = {
    ...baseDataProvider,
    getList: async ({ resource, pagination, filters, sorters, meta }: any) => {
      const response = await fetch(`${API_URL}/${resource}`);
      const json = await response.json();
      return {
        data: json.data || [], 
        total: json.pagination?.total || json.data?.length || 0,
      };
    },
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={myDataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "8BJFOJ-7F6vKD-pJzury",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                // --- CLASSES RESOURCE ---
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  meta: { label: "Classes", icon: <GraduationCap /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  }
                >
                  <Route index element={<Dashboard />} />

                  {/* --- CLASSES ROUTES --- */}
                  <Route path="/classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassCreate />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;