import { Route, Switch } from "react-router-dom";
import Todos from "./pages/Todos";
import Syncronization from "./pages/Syncronization";

const Routes = () => {
  return (
    <Switch>
      <Route path="/posts" render={(props) => <Todos {...props} />} />
      <Route path="/syncronization" render={(props) => <Syncronization {...props} />} />
      <Route path="/" exact render={(props) => <Todos {...props} />} />
    </Switch>
  );
};

export default Routes;
