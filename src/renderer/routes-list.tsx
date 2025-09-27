import { JSX } from "react";
import {
  LucideProps,
  Timer,
  History,
  Activity,
  BarChart3,
  Settings,
} from "lucide-react";
import { DashboardView } from "./components/dashboard/dashboard";
import { HistoryView } from "./components/history/history";

export type Route = {
  id: string;
  element: () => JSX.Element;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  description: string;
};

export const routesList: Route[] = [
  {
    id: "/",
    element: DashboardView,
    label: "Focus Dashboard",
    icon: Timer,
    description: "Live tracking & today's summary",
  },
  {
    id: "activity",
    element: () => <>activity</>,
    label: "Timeline",
    icon: Activity,
    description: "Detailed activity timeline",
  },
  {
    id: "analytics",
    element: () => <>analytics</>,
    label: "Analytics",
    icon: BarChart3,
    description: "Time patterns & insights",
  },
  {
    id: "history",
    element: HistoryView,
    label: "History",
    icon: History,
    description: "Past days & trends",
  },
  {
    id: "settings",

    element: () => <>settings</>,
    label: "Settings",
    icon: Settings,
    description: "Categories & preferences",
  },
];
