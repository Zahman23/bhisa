import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Reserve from "../pages/Reserve";
import Payment from "../pages/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "reserve", element: <Reserve /> },
      { path: "payment", element: <Payment /> },
    ],
  },
]);
