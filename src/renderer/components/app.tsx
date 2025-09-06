import { HashRouter, Route, Routes } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import { routesList } from "../routes-list";

export const App = () => {
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);

  return (
    <div className="flex w-full">
      <HashRouter>
        <nav className={`h-screen h-full`}>
          <Sidebar
            collapsed={collapsedSidebar}
            onToggle={() => setCollapsedSidebar(!collapsedSidebar)}
          />
        </nav>
        <main className="sticky top-0 bg-blue-200 flex-grow h-screen">
          <Routes>
            {routesList.map((route) => (
              <Route
                key={route.id}
                path={route.id}
                element={<route.element />}
              />
            ))}
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
};
