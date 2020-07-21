<template>
    <div
            class="col p-2 m-2 bg-light shadow-lg"
            v-if="$route.path.split('/').length > 2">
        <div>
            <tableHeader
                    :search-placeholder-text="`Authority's name`"
                    v-on:input-cleared="inputCleared"
                    v-on:on-size-per-page-changed="onSizePerPageChanged"
                    v-on:search-button-clicked="searchAuthorities"
            />

            <loader v-if="loading"/>

            <table class="mt-2 table table-striped table-bordered table-responsive-sm"
                   v-else-if="!loading && currentAuthorities.length">
                <thead class="thead-dark">
                <tr class="d-flex">
                    <th @click="sortByIndex"
                        class="thead-clickable col-2 col-sm-2"
                        scope="col">ID
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
                        :key="authority.id"
                        v-for="authority in currentAuthorities"
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

            <div class="row" v-if="allAuthorities.length >= sizePerPage">
                <div class="col col-lg-2"></div>
                <div class="col-12 col-lg-7">
                    <div class="mt-3 ">
                        <b-pagination
                                :per-page="sizePerPage"
                                :total-rows="totalElements"
                                @change="onPageChange"
                                align="center"
                                aria-controls="users-table"
                                pills
                                v-model="currentPageNumber"
                        ></b-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import loader from '../components/Loader'
    import authorityRow from '../components/users/UserAuthorityRow'
    import tableHeader from '../components/TableSizeAndSearchHeader'

    export default {
        name: "UserDetails",
        components: {
            loader, authorityRow, tableHeader
        },
        data() {
            return {
                apiURL: this.$root.apiURL + 'users/' + this.$route.params.id + '/authorities',
                authoritiesApiURL: this.$root.apiURL + 'authorities',
                userID: this.$route.params.id,
                allAuthorities: [],
                totalElements: -1,
                currentPageNumber: 1,
                sizePerPageOptions: [
                    {value: 5, text: '5'},
                    {value: 10, text: '10'},
                    {value: 25, text: '25'},
                    {value: 50, text: '50'},
                ],
                sizePerPage: 5,
                // TODO save to cookies
                loading: true,
                isChanged: false,
                sortBy: '',
                descending: false
            }
        },
        created() {
            this.getAuthorities()
        },
        methods: {
            getAuthorities(authorityName = '') {
                this.allAuthorities = []
                this.$http
                    .get(this.authoritiesApiURL, {params: {'name': authorityName}}).then(response => {
                    response.data.authorities.forEach(authority => {
                        this.allAuthorities.push({
                            name: authority.name,
                            isUserHave: false,
                            id: authority.authority_id,
                            isActive: false
                        })
                    })

                    this.$http
                        .get(this.apiURL).then(response => {
                        response.data.authorities.forEach(authority => {
                            console.log('before search')
                            let authorityRowVal = this.allAuthorities.find(value => {
                                console.log(value.id + ' ' + authority.authority_id)
                                return value.id === authority.authority_id;
                            })
                            console.log('after search')

                            if (!authorityRowVal) {
                                console.log("Unexpected authority: " + authority.name)
                                console.log(authority)
                            } else {
                                authorityRowVal.isUserHave = true
                                authorityRowVal.isActive = true
                            }
                        })

                        this.totalElements = this.allAuthorities.length
                        this.loading = false;
                    })
                        .catch(() => this.loading = false)
                })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.status)
                            if (error.response.status === 403)
                                this.$root.messageBoxOk('Error while loading authorities',
                                    "You have no authorities to perform this action.")
                            else
                                this.$root.messageBoxOk('Error while loading authorities',
                                    error.response.statusText + '' + error.response.status)
                        } else if (error.request) {
                            console.log(error.request)
                            this.$root.messageBoxOk('Error while loading authorities',
                                "Error while connecting to server")
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                    });
            },
            sortDescending(authority1, authority2) {
                if (authority1[this.sortBy] > authority2[this.sortBy])
                    return -1;
                if (authority1[this.sortBy] < authority2[this.sortBy])
                    return 1;
                return 0;
            },
            sortAscending(authority1, authority2) {
                if (authority1[this.sortBy] < authority2[this.sortBy])
                    return -1;
                if (authority1[this.sortBy] > authority2[this.sortBy])
                    return 1;
                return 0;
            },
            sortByIndex() {
                this.descending = this.sortBy === 'id' && !this.descending
                this.sortBy = 'id'
            },
            sortByAuthorityName() {
                this.descending = this.sortBy === 'name' && !this.descending
                this.sortBy = 'name'
            },
            sortByUserHave() {
                this.descending = this.sortBy === 'isActive' && !this.descending;
                this.sortBy = 'isActive'
            },
            authorityChanged(authority) {
                this.isChanged = true
                this.allAuthorities.find((value) => {
                    return value.name === authority.name;
                }).isActive = authority.isActive
            },
            resetAuthorities() {
                this.isChanged = false
                this.allAuthorities.forEach(authority => {
                    authority.isActive = authority.isUserHave
                })
            },
            updateAuthorities() {
                let authorities = []
                this.allAuthorities.forEach(authority => {
                    if (authority.isActive)
                        authorities.push({'authority_id': authority.id, 'name': authority.name})
                })
                this.$http.post(this.apiURL, {"authorities": authorities}).then(() => {
                    this.$router.go(0)
                    if (this.$route.params.id === this.$root.currentUser.id) {
                        let userAuthorities = []
                        authorities.forEach(authority => {
                            userAuthorities.push(authority.name)
                        })
                        console.log(userAuthorities)
                        this.$root.currentUser.userAuthorities = userAuthorities
                        localStorage.setItem('currentUser', JSON.stringify(this.$root.currentUser))
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
            },
            onPageChange(page) {
                if (page !== this.currentPageNumber) {
                    this.currentPageNumber = page
                    console.log(page)
                }
            },
            onSizePerPageChanged(newSize) {
                this.sizePerPage = newSize
                this.currentPageNumber = 1
            },
            searchAuthorities(searchInput) {
                this.getAuthorities(searchInput)
            },
            inputCleared() {
                this.getAuthorities()
            }
        },
        computed: {
            sortedAuthorities() {
                let sortedAuthorities = this.allAuthorities.slice()
                if (this.sortBy && this.descending)
                    return sortedAuthorities.sort(this.sortDescending)
                else if (this.sortBy)
                    return sortedAuthorities.sort(this.sortAscending)
                return this.allAuthorities
            },
            currentAuthorities() {
                return this.sortedAuthorities.slice(
                    (this.currentPageNumber - 1) * this.sizePerPage, this.currentPageNumber * this.sizePerPage
                )
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