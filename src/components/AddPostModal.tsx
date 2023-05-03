import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import { TransitionProps } from "@mui/material/transitions";
import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import { useMutation } from "urql";
import * as Yup from "yup";
import { useAppDispatch } from "../app/hooks";
import { fetchPosts } from "../features/posts/posterSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IAddPostModal {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICreatePostDto {
  body: string;
  title: string;
}

const AddPostModal: React.FC<IAddPostModal> = ({
  showAddModal,
  setShowAddModal,
}) => {
  const dispatch = useAppDispatch();
  const CREATE_POST_MUTATION = `
  mutation (
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;

  const [createPostResult, createPost] = useMutation(CREATE_POST_MUTATION);

  const handleSubmit = (
    values: ICreatePostDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    createPost({
      input: {
        title: values.title,
        body: values.body,
      },
    }).then(() => {
      setShowAddModal(false);
      toast.success("Added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
      dispatch(fetchPosts(1, 10));
      setSubmitting(false);
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title Is Required"),
    body: Yup.string().required("Body Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={showAddModal}
      TransitionComponent={Transition}
      onClose={() => setShowAddModal(false)}
      maxWidth="md"
    >
      <DialogTitle>Add Post</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Body"
                name="body"
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.body && Boolean(formik.errors.body)}
                helperText={formik.touched.body && formik.errors.body}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" size="small" type="submit">
            {formik.isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPostModal;
