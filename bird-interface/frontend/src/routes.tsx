import { createBrowserRouter } from "react-router";
import Home from "./home";
import SettingsPage from "./settings";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: async () => {
      const ipRes = await (await fetch('/api/camAddr')).text();
      const portRes = await (await fetch('/api/camPort')).text();
      return { streamUrl : "http://" + ipRes + ":" + portRes + "/view/whep"};
    }
  },
  {
    path: "/settings",
    element: <SettingsPage/>,
    loader: async () => {return {};},
  }
])