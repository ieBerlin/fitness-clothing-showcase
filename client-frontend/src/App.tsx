import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
}

export default App;
