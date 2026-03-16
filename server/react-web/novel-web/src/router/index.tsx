import { createHashRouter, RouterProvider, RouteObject } from "react-router-dom";
import { Suspense } from "react";
import { Spin } from "antd";
import { routes } from "./routes";

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <Spin
        size="large"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />
    }
  >
    {children}
  </Suspense>
);

function wrapRoutes(routes: RouteObject[]): RouteObject[] {
  return routes.map(route => ({
    ...route,
    element: route.element
      ? <SuspenseWrapper>{route.element}</SuspenseWrapper>
      : route.element,
    children: route.children ? wrapRoutes(route.children) : undefined
  })) as RouteObject[];
}

const router = createHashRouter(wrapRoutes(routes as RouteObject[]));

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};