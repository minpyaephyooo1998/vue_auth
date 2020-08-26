<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>
    </v-app-bar>

    <v-main>
      <v-container class="scroll-y" fluid>
        <v-row align="center" justify="center">
          <v-col cols="8" md="8">
            <v-card class="ml-5 mr-5">
              <v-app-bar dark color="primary">
                <v-btn icon>
                  <v-icon>mdi-offer</v-icon>
                </v-btn>
                <v-toolbar-title>Posts</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="800px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text outlined color="white" v-bind="attrs" v-on="on">
                      <v-icon color="white">mdi-plus</v-icon>ADD
                    </v-btn>
                  </template>
                  <v-card>
                    <v-form
                      @submit.prevent="savePost"
                      ref="postData"
                      lazy-validation
                      enctype="multipart/form-data"
                      autocomplete="off"
                    >
                      <v-card-title>
                        <span class="headline">Post</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex x12 sm12 md12>
                              <v-text-field
                                label="Name*"
                                v-model="postData.name"
                                color="blue"
                              ></v-text-field>
                              <v-text-field
                                label="Description"
                                v-model="postData.description"
                                color="blue"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn outlined text color="red" @click="close" small>
                          <v-icon left>mdi-exit-to-app</v-icon>Close
                        </v-btn>
                        <v-btn outlined text color="blue" type="submit" small>
                          <v-icon left>mdi-post</v-icon>{{ saveDialog }}
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-app-bar>
              <v-container>
                <v-card class="mx-auto elevation-19">
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-find"
                      label="Search"
                      hide-details
                      single-line
                      color="primary"
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    item-key="id"
                    :headers="headers"
                    :items="posts"
                    :search="search"
                  >
                    <template :item="item">
                      <v-btn
                        color="primary"
                        class="mx-2"
                        fab
                        x-small
                        text
                        @click="editPost(item)"
                        outlined
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        color="red"
                        class="mx-2"
                        fab
                        text
                        x-small
                        @click="deletePost(item._id)"
                        outlined
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>

                    <template v-slot:no-results>
                      <v-alert :value="true" color="red" icon="mdi-warning">
                        Your search {{ search }} dose not exit
                      </v-alert>
                    </template>
                  </v-data-table>
                </v-card>
              </v-container>
            </v-card>
            <v-snackbar v-model="snackbar" bottom :color="color">
              <template>
                {{ text }}
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-btn
      v-scroll="onScroll"
      bottom
      app
      color="primary"
      fab
      fixed
      right
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",

  components: {},

  data: () => ({
    dialog: false,
    search: "",
    snackbar: false,
    text: "",
    color: "",
    fab: false,
    posts: [],
    headers: [
      { text: "Name", value: "name", sortable: true },
      { text: "Description", value: "description", sortable: false },
      { text: "Action", value: "actions", sortable: true, width: "180px" },
    ],
    postData: {
      name: "",
      description: "",
    },
    default: {
      name: "",
      description: "",
    },
    editedIndex: -1,
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  mounted() {
    this.loadPost();
  },

  computed: {
    saveDialog() {
      return this.editedIndex === -1 ? "Save" : "Edit";
    },
  },

  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.postData = Object.assign({}, this.default);
        this.editedIndex = -1;
      }, 300);
    },

    loadPost() {
      let apiURL = "http://localhost:3000/api/post";
      axios
        .get(apiURL)
        .then((res) => {
          this.posts = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    savePost() {
      if (this.editedIndex > -1) {
        // console.log("Updated");
        this.updatePost();
      } else {
        this.createPost();
      }
    },

    createPost() {
      let apiUrl = "http://localhost:3000/api/post/create-post";
      axios
        .post(apiUrl, this.postData)
        .then(() => {
          this.postData = {
            name: "",
            description: "",
          };
          this.close();
          this.loadPost(),
            this.color = "success",
            this.text = "Post has been saved",
            this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    editPost(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.postData = Object.assign({}, item);
      this.dialog = true;
    },

    updatePost() {
      let apiURL = `http://localhost:3000/api/post/update-post/${this.postData._id}`;
      axios
        .post(apiURL, this.postData)
        .then((res) => {
          console.log(res);
          this.close();
          this.loadPost();
          this.color = "info";
          this.text = "Post has been modified";
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
          console.log(this.$route.params.id);
        });
    },

    deletePost(id) {
      this.$swal({
        title: "Are your sure?",
        text: "You will not be able to go back",
        // icon: 'mdi-home',
        showCancelButton: true,
        confimButtonColor: "blue",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          try {
            let apiURL = `http://localhost:3000/api/post/delete-post/${id}`;
            let indexOfArrayItem = this.posts.findIndex((i) => i._id === id);
            axios
              .delete(apiURL)
              .then(() => {
                this.posts.splice(indexOfArrayItem, 1);
              })
              .catch((err) => {
                console.log(err);
              });
            this.$swal("Deleted!", "Post has been deleted", "success");
            (this.color = "error"),
              (this.text = "Post has been deleted"),
              (this.snackbar = true);
          } catch (e) {
            this.$swal("Failde", "There was something wrong", "warning");
          }
        }
      });
    },
  },
};
// v-slot:item.actions="{ item }"
</script>
