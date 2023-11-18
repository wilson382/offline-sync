import Drawer from "./components/Drawer";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Routes from "./Routes";
import CssBaseline from "@material-ui/core/CssBaseline";

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#2d3c91",
      },
      secondary: {
        main: "#860c15",
      },
    },
  });

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Drawer />
        <Paper variant="outlined" style={{ minHeight: "100vh" }}>
          <Routes />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default App;
