import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div>
      <p>Focus Flow</p>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/page2">Page 2</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
