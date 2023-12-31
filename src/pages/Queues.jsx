import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { useSelector } from "react-redux";
import { BsCloudCheck } from "react-icons/bs";

const Queues = () => {
  const { offline } = useSelector((state) => {
    return {
      offline: state.offline,
    };
  });
  const queues = [...offline.outbox.map((x) => x.payload)];
  const queuesTotal = offline.outbox.length;

  if (queuesTotal === 0)
    return (
      <div className="container text-center mt-5">
        <div className="mt-5 mb-4 text-center text-success">
          <BsCloudCheck size="8em" />
        </div>

        <Typography variant="h6" gutterBottom>
          Nenhum dado pendente!
        </Typography>
        <Typography variant="body1">
          No momento não há dados pendentes, todos os dados foram salvos no
          aplicativo central para que seguro.
        </Typography>
      </div>
    );

  return (
    <div className="container mt-3 mb-5">
      <Typography variant="h6" gutterBottom>
        Os seguintes dados ainda não foram salvos.
      </Typography>
      <div style={{ maxHeight: 500, width: "100%", overflow: "scroll" }}>
        {queues.map((x) => (
          <Box key={x.id} component={"div"} p={1}>
            <Typography variant="h6" className="pl-2" gutterBottom>
              {x.title}
            </Typography>

            {x.syncName && (
              <Typography variant="body1" className="pl-2" gutterBottom>
                {x.syncName}
              </Typography>
            )}

            <Typography
              variant="body2"
              className="pl-2 text-danger"
              gutterBottom
            >
              No. tentativas {offline.retryCount}
            </Typography>

            <Divider />
          </Box>
        ))}
      </div>
    </div>
  );
};

export default Queues;
