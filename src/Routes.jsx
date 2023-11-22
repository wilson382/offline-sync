import { Route, Switch } from "react-router-dom";
import Todos from "./pages/Todos";
import Queues from "./pages/Queues";

const Routes = () => {
  return (
    <Switch>
      <Route path="/posts" render={(props) => <Todos {...props} />} />
      <Route path="/queues" render={(props) => <Queues {...props} />} />
      <Route path="/" exact render={(props) => <Todos {...props} />} />
    </Switch>
  );
};

export default Routes;
