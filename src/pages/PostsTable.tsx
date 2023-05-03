import AddIcon from "@mui/icons-material/Add";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AddPostModal from "../components/AddPostModal";
import { fetchPosts } from "../features/posts/posterSlice";

const PostsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.posts);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
    {
      field: "title",
      headerName: "Title",
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      flex: 0.3,
    },
  ];

  useEffect(() => {
    dispatch(fetchPosts(pageNumber, pageSize));
  }, [dispatch, pageNumber, pageSize]);

  return (
    <Container>
      {error ? (
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography justifyContent="center" variant="h5" color="error">
            Failed To Get Posts
          </Typography>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddModal(true)}
            >
              Add Post
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                height: 615,
                width: "100%",
                "& .super-app-theme--header": {
                  backgroundColor: "#1565C0",
                  color: "#FFFFFF",
                },
                "& .Mui-even": {
                  backgroundColor: "#F2F2F2",
                },
              }}
            >
              <DataGrid
                rows={data || []}
                columns={columns}
                loading={loading}
                paginationMode="server"
                rowCount={100}
                page={pageNumber - 1}
                pageSize={pageSize}
                onPageChange={(newPage) => {
                  setPageNumber(newPage + 1);
                }}
                headerHeight={40}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0
                    ? "Mui-even"
                    : "Mui-odd"
                }
              />
            </Box>
          </Grid>
          <ToastContainer />
        </Grid>
      )}

      {showAddModal && (
        <AddPostModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      )}
    </Container>
  );
};

export default PostsTable;
