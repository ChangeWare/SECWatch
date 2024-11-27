import HomeView from "./views/HomeView";
import { homePaths } from "./paths";

export const homeRoutes = [
    {
      path: homePaths.default,
      element: <HomeView />
    }
];