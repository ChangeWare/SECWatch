import HomeView from "./views/HomeView";
import { homePaths } from "./paths";
import AboutView from "@features/home/views/AboutView.tsx";
import ContactView from "@features/home/views/ContactView.tsx";
import PrivacyPolicyView from "@features/home/views/PrivacyPolicyView.tsx";
import TermsOfServiceView from "@features/home/views/TermsOfServiceView.tsx";

export const homeRoutes = [
    {
      path: homePaths.home,
      element: <HomeView />
    },
    {
        path: homePaths.about,
        element: <AboutView />
    },
    {
        path: homePaths.contact,
        element: <ContactView />
    },
    {
        path: homePaths.privacy,
        element: <PrivacyPolicyView />
    },
    {
        path: homePaths.terms,
        element: <TermsOfServiceView />
    }
];