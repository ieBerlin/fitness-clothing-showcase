import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Modal from "./modal/Modal";

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Modal />
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
