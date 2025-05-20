//react
import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

//paths
import { routers } from "./routes";

//components
import Loading from "./components/Loading";

function App() {
  const Router = useRoutes(routers);
  return <>
    <Suspense fallback={<Loading />}>
      {Router}
    </Suspense>


  </>;
}

export default App;
