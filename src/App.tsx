import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Componente de teste minimalista
const TestPage = () => (
  <div style={{
    backgroundColor: '#1a1a1a',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontFamily: 'sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ React Funcionando!</h1>
      <p>O problema está nos Contexts ou Páginas.</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
