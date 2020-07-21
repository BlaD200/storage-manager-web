<template>
    <div>
        <div class="col pt-0 pb-2 px-2 mb-3 bg-light shadow-lg" id="users-table-div">

            <hr>

            <addUserForm v-on:add-user="addUser"></addUserForm>

            <hr>

            <tableHeader
                    :search-placeholder-text="`Name, username or email...`"
                    v-on:search-button-clicked="searchUsers"
                    v-on:on-size-per-page-changed="onSizePerPageChanged"
            />

            <loader v-if="loading"/>

            <table
                    class="mt-2 table table-striped table-bordered table-responsive-sm"
                    id="users-table"
                    v-else-if="!loading && users.length">
                <thead class="thead-dark">
                <tr>
                    <th @click="sortById"
                        class="thead-clickable"
                        scope="col">ID
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

            <div class="mt-3">
                <b-pagination
                        :per-page="sizePerPage"
                        :total-rows="totalElements"
                        @change="onPageChange"
                        v-model="currentPageNumber"
                        align="center"
                        aria-controls="users-table"
                        pills
                ></b-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    import userRow from '../components/users/UserTableRow'
    import addUserForm from '../components/users/AddUser'
    import loader from '../components/Loader'
    import tableHeader from '../components/TableSizeAndSearchHeader'

    export default {
        name: "Users",
        components: {
            userRow, addUserForm, loader, tableHeader
        },
        data: function () {
            return {
                apiURL: this.$root.apiURL + 'users/',
                loading: true,
                users: [],
                totalElements: -1,
                currentPageNumber: 1,
                sizePerPage: 5,
                sortBy: '',
                descending: false
            }
        },
        created: function () {
            this.getUsersPage(0)
        },
        methods: {
            getUsersPage(page, searchInput) {
                let config
                if (searchInput)
                    config = {
                        'params':
                            {
                                'page': page,
                                'size': this.sizePerPage,
                                'username': searchInput,
                                'name': searchInput,
                                'email': searchInput
                            }
                    }
                else
                    config = {
                        'params':
                            {'page': page, 'size': this.sizePerPage}
                    }

                this.loading = true
                this.$http
                    .get(this.apiURL, config)
                    .then(response => {
                        this.loading = false

                        this.users = []
                        response.data.content.forEach(user => this.users.push(user))
                        this.totalElements = response.data.totalElements
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
            },
            onPageChange(page) {
                if (page !== this.currentPageNumber)
                    this.getUsersPage(page - 1)
            },
            onSizePerPageChanged(newSize) {
                this.sizePerPage = newSize
                this.getUsersPage(this.currentPageNumber - 1)
            },
            searchUsers(searchInput) {
                // TODO show all after input cleared
                this.getUsersPage(this.currentPageNumber - 1, searchInput)
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
                // TODO sort users on server side
            }
        }
    }
</script>

<style scoped>
    .thead-clickable {
        cursor: pointer;
    }
</style>