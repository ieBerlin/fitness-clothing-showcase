import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
import NavbarProvider from "./store/navbarStore";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavbarProvider>
        <RouterProvider router={routes} />
      </NavbarProvider>
    </QueryClientProvider>
  );
}

export default App;
