import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { BsCloudArrowUpFill } from "react-icons/bs";
import Badge from "@material-ui/core/Badge";
import InternetConection from "./InternetConection";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 10,
  },
  fullList: {
    width: "auto",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  selected: {
    backgroundColor: "#7f8691 !important",
    color: "white",
    fontWeight: 600,
  },

  title2: {
    flexGrow: 1,
  },
}));

export default function Drawer() {
  const history = useHistory();
  const { totalQueues } = useSelector((state) => {
    return {
      totalQueues: state.offline.outbox.length,
    };
  });

  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <InternetConection />

      <AppBar
        style={{ marginLeft: -1, marginTop: -1 }}
        position="static"
        color="secondary"
      >
        <Toolbar>
          <Typography
            onClick={() => history.push("/")}
            className={classes.title2}
            variant="h6"
            noWrap
          >
            Pagina inicial
          </Typography>

          {+totalQueues > 0 && (
            <div>
              <IconButton
                aria-haspopup="true"
                onClick={() => history.push("/queues")}
                color="inherit"
              >
                <Badge
                  overlap="rectangular"
                  badgeContent={+totalQueues}
                  color="primary"
                >
                  <BsCloudArrowUpFill size="1.1em" />
                </Badge>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
