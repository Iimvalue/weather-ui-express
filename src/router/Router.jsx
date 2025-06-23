import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/Layout"; 
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Weather from "../pages/Weather";
import HistoryPage from "../pages/History";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/weather", element: <Weather /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;