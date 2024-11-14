import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
import NavbarProvider from "./store/navbarStore";
import Modal from "./modal/Modal";
import { Provider } from "react-redux";
import { store } from "./store/modalStore";
function App() {
  return (
    <Provider store={store}>
      <Modal />
      <QueryClientProvider client={queryClient}>
        <NavbarProvider>
          <RouterProvider router={routes} />
        </NavbarProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
