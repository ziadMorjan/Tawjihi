//react
import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

// components
import Loading from "./components/Loading";

// paths
import { routers } from "./routes";

function App() {
  const Router = useRoutes(routers);

  return (
    <Suspense fallback={<Loading />}>
      {Router}
    </Suspense>
  );
}

export default App;
