<template>
    <div>
        <div class="col pt-0 pb-2 px-2 bg-light shadow-lg" id="users-table">

            <hr>

            <addUserForm v-on:add-user="addUser"></addUserForm>

            <hr>

            <loader v-if="loading"/>

            <table class="mt-2 table table-striped table-bordered table-responsive-sm"
                   v-else-if="!loading && users.length">
                <thead class="thead-dark">
                <tr>
                    <th @click="sortById"
                        class="thead-clickable"
                        scope="col">#
                    </th>
                    <th @click="sortByUsername"
                        class="thead-clickable"
                        scope="col">Username
                    </th>
                    <th class="thead-clickable"
                        scope="col">Full name
                    </th>
                    <th class="thead-clickable"
                        scope="col">Email
                    </th>
                    <th class="thead-clickable"
                        scope="col">Actions
                    </th>
                </tr>
                </thead>

                <tbody class="table-hover">
                <userRow :key="user.id" :user="user" v-for="user in sortedUsers"
                         v-on:edit-user="editUser"
                         v-on:show-delete-popup="showDeleteModal"></userRow>
                </tbody>
            </table>

            <h3 v-else>No users</h3>

        </div>
    </div>
</template>

<script>
    import userRow from '../components/users/UserTableRow'
    import addUserForm from '../components/users/AddUser'
    import loader from '../components/Loader'

    export default {
        name: "Users",
        components: {
            userRow, addUserForm, loader
        },
        data: function () {
            return {
                apiURL: this.$root.apiURL + 'users/',
                loading: true,
                users: [],
                sortBy: '',
                descending: false
            }
        },
        created: function () {
            this.$http
                .get(this.apiURL)
                .then(response => {
                    this.loading = false
                    response.data.forEach(user => this.users.push(user))
                })
                .catch(error => {
                    this.loading = false
                    if (error.response) {
                        console.log(error.response.status)
                        if (error.response.status === 403)
                            this.$root.messageBoxOk('Error while loading users',
                                "You have no authorities to perform this action.")
                        else
                            this.$root.messageBoxOk('Error while loading users user',
                                error.response.statusText + '' + error.response.status)
                    } else if (error.request) {
                        console.log(error.request)
                        this.$root.messageBoxOk('Error while loading users',
                            "Error while connecting to server")
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                });
        },
        methods: {
            showDeleteModal(userID, username) {
                this.$bvModal.msgBoxConfirm('Do you want to delete ' + username + '?', {
                    title: 'Delete user',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'DELETE',
                    cancelTitle: 'Cancel',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                    .then(value => {
                        if (value) {
                            console.log("delete: ", userID, username)
                            this.deleteUser(userID)
                        }
                    })
                    .catch(err => {
                        this.$root.messageBoxOk('Error while deleting user', err, 'secondary')
                    })
            },
            deleteUser(userID) {
                try {
                    this.$http.delete(this.apiURL + userID).then(() => {
                        this.$router.go(0)
                    })
                } catch (e) {
                    this.$root.messageBoxOk('Error while deleting user', e, 'secondary')
                }
            },
            editUser(user) {
                console.log("EDITING " + user.id)
                console.log(this.$root.currentUser.username)
                // this.messageBoxOk(userID, this.$root.currentUser, '')
            },
            addUser(form) {
                let data = {'username': form.username, 'password': form.password}
                console.log(data)
                this.$http
                    .put(this.apiURL, data)
                    .then(response => {
                        console.log(response)
                        this.$router.go(0)
                    })
                    .catch(error => {
                        if (error.response) {
                            this.$root.messageBoxOk('Error while creating user', error.response.data.message)
                        } else if (error.request) {
                            console.log(error.request)
                            this.$root.messageBoxOk('Error while creating user',
                                "Error while connecting to server")
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                    });
            },
            sortByUsername() {
                this.sortBy = 'username'
                this.descending = !this.descending
            },
            sortById() {
                this.sortBy = 'id'
                this.descending = !this.descending
            },
            sortDescending(user1, user2) {
                if (user1[this.sortBy] < user2[this.sortBy])
                    return -1;
                if (user1[this.sortBy] > user2[this.sortBy])
                    return 1;
                return 0;
            },
            sortAscending(user1, user2) {
                if (user1[this.sortBy] > user2[this.sortBy])
                    return -1;
                if (user1[this.sortBy] < user2[this.sortBy])
                    return 1;
                return 0;
            }
        },
        computed: {
            sortedUsers() {
                let sortedUsers = this.users.slice()
                if (this.sortBy && this.descending)
                    return sortedUsers.sort(this.sortDescending)
                else if (this.sortBy)
                    return sortedUsers.sort(this.sortAscending)
                return this.users;
            }
        }
    }
</script>

<style scoped>
    .thead-clickable {
        cursor: pointer;
    }
</style>