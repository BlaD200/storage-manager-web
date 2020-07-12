<template>
    <tr>
        <th scope="row">{{ user.id }}</th>
        <td>
            <router-link :to="{name: 'UserDetails', params: {id : user.id}}" title="Go to user authorities" v-b-tooltip
                         v-if="getUserAuthorityPermission">
                {{ user.username }}
            </router-link>
            <span v-else>{{ user.username }}</span>
        </td>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>
            <span class="col-3">
                <button
                        :disabled="!deleteUserPermission"
                        :title="!deleteUserPermission ?
                                    'You haven\'t rights to delete users' : 'Delete user'"
                        @click="$emit('show-delete-popup', user.id, user.username)"
                        class="btn btn-outline-danger"
                        id="delete-user-btn"
                        v-b-tooltip.hover.bottom>
                    <svg class="bi bi-x" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"
                         xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                          fill-rule="evenodd"/>
                    <path d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
                          fill-rule="evenodd"/>
                </svg>
                </button>
            </span>
            <span class="col-3">
                <button
                        :disabled="!editUserPermission"
                        :title="!editUserPermission ?
                                    'You haven\'t rights to edit users' : 'Edit user'"
                        @click="$emit('edit-user', {'id' : user.id})"
                        class="btn btn-outline-primary"
                        id="edit-user-btn"
                        v-b-tooltip.hover.bottom>
                    <svg class="bi bi-pencil-square" fill="currentColor" height="1em" viewBox="0 0 16 16"
                         width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              fill-rule="evenodd"/>
                    </svg>
                </button>
            </span>
        </td>
    </tr>
</template>

<script>
    export default {
        name: "user-row",
        props: ['user'],
        computed: {
            deleteUserPermission() {
                return this.$root.currentUser.userAuthorities.includes('DELETE_USER')
            },
            editUserPermission() {
                return this.$root.currentUser.userAuthorities.includes('UPDATE_USER')
            },
            getUserAuthorityPermission() {
                return this.$root.currentUser.userAuthorities.includes('GET_AUTHORITIES')
            }
        }
    }
</script>

<style scoped>

</style>