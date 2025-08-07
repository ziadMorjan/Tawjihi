import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import DashboardApp from "./dashboard/App";
import { MaterialUIControllerProvider } from "./dashboard/context";

function App() {
  
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
      
      {/* <MaterialUIControllerProvider>
        <DashboardApp />
      </MaterialUIControllerProvider> */}
    </Suspense>
  );
}

export default App;
