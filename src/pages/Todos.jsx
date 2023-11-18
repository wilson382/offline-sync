import { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Loading from "../components/Loading";
import { getUniqueID } from "../functions";
import { useSelector, useDispatch } from "react-redux";
import {
  createTodo,
  selectError,
  selectStatus,
  selectTodos,
  thunkTodosFetch,
  thunkTodosDelete,
} from "../store/slices/todos";
import { useAlert } from "react-alert";
import Box from "@material-ui/core/Box";

const Todos = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const status = useSelector(selectStatus);
  const todos = useSelector(selectTodos);

  useEffect(() => {
    if (status === "idle") dispatch(thunkTodosFetch());
  }, [status, dispatch]);

  if (status === "loading") return <Loading />;

  if (error)
    return (
      <div className="alert alert-danger mt-3">
        <Typography variant="subtitle2" component="p">
          {error}
        </Typography>
      </div>
    );

  const handleTodoCreate = () => {
    const data_id = getUniqueID();
    const syncronization_id = getUniqueID();
    const todo = {
      id: data_id,
      title: "tarefa " + data_id,
    };

    dispatch(createTodo({ postData: todo, data_id, syncronization_id }));
    alert.success("nova tarefa criada!", { position: "bottom center" });
  };

  const handleTodosDelete = () => {
    dispatch(thunkTodosDelete());
    alert.error("Todas as tarefas excluídas!", { position: "bottom center" });
  };

  return (
    <div className="container mt-3 mb-5">
      <Box component={"div"} paddingTop={3} paddingBottom={3}>
        <Button fullWidth variant="contained" color="primary" onClick={handleTodoCreate}>
          Criar nova tarefa
        </Button>
      </Box>

      <Box component={"div"} paddingBottom={5}>
        <Button fullWidth variant="contained" color="secondary" onClick={handleTodosDelete}>
          excluir nova tarefa
        </Button>
      </Box>

      <Typography variant="h6" component="h4" gutterBottom>
        Coisas para fazer
      </Typography>

      {todos.length === 0 ? (
        <div className="mt-3">
          <Typography variant="subtitle1" component="p" paragraph>
            Nesta página você pode ver a lista de tarefas.
          </Typography>

          <Typography variant="body1" component="p" gutterBottom>
            No momento nenhuma tarefa foi cadastrada!
          </Typography>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">preenchido</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index}>
                <td className="font-italic">{index + 1}</td>
                <td className="font-italic">{todo.title}</td>
                <td className="font-italic">{todo.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Todos;
