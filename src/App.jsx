import { RouterProvider } from "react-router-dom";
import router from "./router";
import { FinanceContextProvider } from "./contexts/FinanceContext";

export default function App() {
  return (
    <FinanceContextProvider>
      <RouterProvider router={router} />
    </FinanceContextProvider>

  )
}