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

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:8001/api";

function App() {
  const baseDataProvider = dataProvider(API_URL);

  const myDataProvider: any = {
    ...baseDataProvider,
    getList: async ({ resource, pagination, filters, sorters, meta }: any) => {
      const queryParams = new URLSearchParams();

      const currentPage = pagination?.current;
      const pageSize = pagination?.pageSize;
      if (typeof currentPage === "number" && currentPage > 0) {
        queryParams.set("page", String(currentPage));
      }
      if (typeof pageSize === "number" && pageSize > 0) {
        queryParams.set("limit", String(pageSize));
      }

      if (Array.isArray(filters)) {
        filters.forEach((filter: any) => {
          if (!filter || typeof filter !== "object" || !("field" in filter) || !("value" in filter)) {
            return;
          }

          const field = String(filter.field ?? "").trim();
          const value = filter.value;

          if (!field || value === undefined || value === null || value === "") {
            return;
          }

          queryParams.set(field, String(value));
        });
      }

      if (meta && typeof meta === "object" && "query" in meta) {
        const query = (meta as { query?: Record<string, unknown> }).query;
        if (query && typeof query === "object") {
          Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
              return;
            }
            queryParams.set(key, String(value));
          });
        }
      }

      if (Array.isArray(sorters) && sorters.length > 0) {
        const firstSorter = sorters[0] as { field?: string; order?: string };
        if (firstSorter?.field) {
          queryParams.set("sort", firstSorter.field);
        }
        if (firstSorter?.order) {
          queryParams.set("order", firstSorter.order);
        }
      }

      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}/${resource}?${queryString}` : `${API_URL}/${resource}`;
      try {
        const response = await fetch(url);
        const contentType = response.headers.get("content-type") ?? "";
        const hasJson = contentType.includes("application/json");
        const payload = hasJson ? await response.json() : null;

        if (!response.ok) {
          const backendMessage =
            typeof payload === "object" && payload !== null && "message" in payload
              ? String((payload as { message?: unknown }).message ?? "")
              : "";

          const message = backendMessage || `Request failed with status ${response.status}`;

          throw {
            message,
            statusCode: response.status,
            errors: payload,
          };
        }

        const json = payload as { data?: unknown[]; pagination?: { total?: number } } | null;

        return {
          data: json?.data || [],
          total: json?.pagination?.total || json?.data?.length || 0,
        };
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          "statusCode" in error
        ) {
          throw error;
        }

        const fallbackMessage =
          error instanceof Error && error.message
            ? error.message
            : "Failed to fetch data from server";

        throw {
          message: fallbackMessage,
          statusCode: 0,
          errors: error,
        };
      }
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