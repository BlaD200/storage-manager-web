<template>
    <div
            class="col p-2 m-2 bg-light shadow-lg"
            v-if="$route.path.split('/').length > 2">
        <div>
            <loader v-if="loading"/>

            <table class="mt-2 table table-striped table-bordered table-responsive-sm"
                   v-else-if="!loading && authorities.length">
                <thead class="thead-dark">
                <tr class="d-flex">
                    <th @click="sortByIndex"
                        class="thead-clickable col-2 col-sm-2"
                        scope="col">#
                    </th>
                    <th @click="sortByAuthorityName"
                        class="thead-clickable col-7 col-sm-7"
                        scope="col">Authority name
                    <th :title="!setUserAuthorities ?
                                    'You haven\'t rights to set users authorities' : 'Grant/deny an authority for user'"
                        @click="sortByUserHave"
                        class="thead-clickable col col-sm"
                        scope="col" v-b-tooltip.hover.topleft
                    >Enabled
                    </th>
                </tr>
                </thead>

                <tbody class="table-hover">
                <authorityRow
                        :authority="authority"
                        :key="authority.index"
                        v-for="authority in sortedAuthorities"
                        v-on:authority-changed="authorityChanged"
                ></authorityRow>
                </tbody>
            </table>

            <h3 v-else>No Authorities</h3>

            <div class="row">
                <div class="col">
                    <div class="float-right mt-sm-2 mt-md-0 mx-sm-2 mx-md-2">
                        <b-button
                                :disabled="!$root.currentUser.userAuthorities.includes('SET_USER_AUTHORITIES') || !isChanged"
                                @click="updateAuthorities"
                                class="mx-2" variant="success">Save
                        </b-button>
                        <b-button
                                :disabled="!isChanged"
                                @click="resetAuthorities"
                                class="ml-2 mr-md-n1" variant="outline-secondary">Reset
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import loader from '../components/Loader'
    import authorityRow from '../components/users/UserAuthorityRow'

    export default {
        name: "UserDetails",
        components: {
            loader, authorityRow
        },
        data() {
            return {
                apiURL: this.$root.apiURL + 'users/' + this.$route.params.id + '/authorities',
                userID: this.$route.params.id,
                authorities: [],
                loading: true,
                isChanged: false,
                sortBy: '',
                descending: false
            }
        },
        created() {
            // TODO receive all authorities
            this.$http.get(this.apiURL).then(response => {
                this.loading = false;
                this.$root.currentUser.userAuthorities.forEach((authority, index) => {
                    this.authorities.push({name: authority, isUserHave: false, index: index, isActive: false})
                })
                response.data.authorities.forEach(authorityName => {
                    let authority = this.authorities.find((value) => {
                        return value.name === authorityName;
                    })
                    if (!authority) {
                        this.authorities.push({
                            name: authorityName,
                            isUserHave: true,
                            index: this.authorities.length,
                            isActive: true
                        })
                    } else {
                        authority.isUserHave = true
                        authority.isActive = true
                    }
                })
            }).catch(() => this.loading = false)
        },
        methods: {
            sortDescending(authority1, authority2) {
                if (authority1[this.sortBy] < authority2[this.sortBy])
                    return -1;
                if (authority1[this.sortBy] > authority2[this.sortBy])
                    return 1;
                return 0;
            },
            sortAscending(authority1, authority2) {
                if (authority1[this.sortBy] > authority2[this.sortBy])
                    return -1;
                if (authority1[this.sortBy] < authority2[this.sortBy])
                    return 1;
                return 0;
            },
            sortByIndex() {
                this.sortBy = 'index'
                this.descending = !this.descending
            },
            sortByAuthorityName() {
                this.sortBy = 'name'
                this.descending = !this.descending
            },
            sortByUserHave() {
                this.sortBy = 'isActive'
                this.descending = !this.descending
            },
            authorityChanged(authority) {
                this.isChanged = true
                this.authorities.find((value) => {
                    return value.name === authority.name;
                }).isActive = authority.isActive
            },
            resetAuthorities() {
                this.isChanged = false
                console.log("HERE")
                this.authorities.forEach(authority => {
                    authority.isActive = authority.isUserHave
                })
            },
            updateAuthorities() {
                let authorities = []
                this.authorities.forEach(authority => {
                    if (authority.isActive)
                        authorities.push(authority.name)
                })
                this.$http.post(this.apiURL, {"authorities": authorities}).then(() => {
                    this.$router.go(0)
                    if (this.$route.params.id === this.$root.currentUser.id) {
                        this.$root.currentUser.userAuthorities = authorities
                        localStorage.setItem('currentUser', this.$root.currentUser)
                    }
                }).catch(error => {
                    let title = 'Error while saving authorities'
                    if (error.response) {
                        this.$root.messageBoxOk(title, error.response.data.message)
                    } else if (error.request) {
                        console.log(error.request)
                        this.$root.messageBoxOk(title,
                            "Error while connecting to server")
                    }
                });
            }
        },
        computed: {
            sortedAuthorities() {
                let sortedAuthorities = this.authorities.slice()
                if (this.sortBy && this.descending)
                    return sortedAuthorities.sort(this.sortDescending)
                else if (this.sortBy)
                    return sortedAuthorities.sort(this.sortAscending)
                return this.authorities
            },
            setUserAuthorities() {
                return this.$root.currentUser.userAuthorities.includes('SET_USER_AUTHORITIES')
            }
        }
    }
</script>

<style scoped>
    .thead-clickable {
        cursor: pointer;
    }
</style>