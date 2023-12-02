import Axios from "axios";

export const TodoApi = {
  createTodo: async function (data) {
    const response = await Axios.post(
      "https://api-prod.wprestamos.com/todos",
      data
    );
    return response;
  },
};
