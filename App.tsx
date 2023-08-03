// react query
import { QueryClientProvider, QueryClient } from "react-query";

// providers

import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "./contexts/AuthContext";

// navigation
import Navigation from "./navigation/Navigation";

const client = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
