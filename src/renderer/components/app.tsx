import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layout";

export const App = () => {
  return (
    <div className="flex flex-col bg-yellow-200 w-full">
      <HashRouter>
        <nav className="sticky top-0 bg-red-200 h-[20vh] w-full">
          <Layout />
        </nav>
        <main className="sticky top-0 bg-blue-200 flex-grow h-[80vh]">
          <Routes>
            <Route path="/" element={<>Home</>} />
            <Route path="/page2" element={<>Page 2</>} />
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
};
