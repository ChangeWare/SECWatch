import HomeView from "./views/HomeView";
import { homePaths } from "./paths";
import AboutView from "@features/home/views/AboutView.tsx";
import ContactView from "@features/home/views/ContactView.tsx";

export const homeRoutes = [
    {
      path: homePaths.default,
      element: <HomeView />
    },
    {
        path: homePaths.about,
        element: <AboutView />
    },
    {
        path: homePaths.contact,
        element: <ContactView />
    }
];