import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
}

export default App;
