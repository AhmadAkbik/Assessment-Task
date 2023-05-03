import { createSlice } from "@reduxjs/toolkit";
import { gql } from "urql";
import { client } from "../..";

const postsSlice = createSlice({
  name: "posts",
  initialState: { loading: false, data: null, error: null },
  reducers: {
    getPostsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getPostsSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    getPostsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchPosts = (page : number , limit : number) => (dispatch: any) => {
  dispatch(postsSlice.actions.getPostsRequest());
  const query = gql`
    query GetPosts($options: PageQueryOptions) {
      posts(options: $options) {
        data {
          id
          title
        }
        meta {
          totalCount
        }
      }
    }
  `;

  client
    .query(query, {
      options: {
        paginate: {
          page: page,
          limit: limit,
        },
      },
    })
    .toPromise()
    .then(({ data }) => {
      console.log('data',data)
      dispatch(postsSlice.actions.getPostsSuccess(data.posts.data));
    })
    .catch((error) => {
      dispatch(postsSlice.actions.getPostsFailure(error.message));
    });
};

export default postsSlice.reducer;
