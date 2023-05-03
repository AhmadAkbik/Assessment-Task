import { Card, CardContent, Grid } from "@mui/material";
import "./App.css";
import PostsTable from "./pages/PostsTable";

const App = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <PostsTable />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default App;
