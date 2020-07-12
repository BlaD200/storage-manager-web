<template>
    <div>
        <b-navbar class="fixed-top" toggleable="lg" type="dark" variant="dark">
            <router-link :to="{name: 'Home'}" class="navbar-brand">Storage manager</router-link>

            <b-navbar-nav class="ml-auto float-right" v-if="!$root.currentUser.username">
                <b-nav-item class="ml-auto"
                            v-b-modal.loginModal
                ><em>Log in</em></b-nav-item>
            </b-navbar-nav>

            <b-navbar-toggle target="nav-collapse" v-else></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav v-if="$root.currentUser.username">
                <b-navbar-nav>
                    <router-link :to="{name: 'Products'}"
                                 class="nav-link"
                                 v-if="$root.currentUser.userAuthorities.includes('GET_USER')"
                    >Products
                    </router-link>

                    <router-link :to="{name: 'Groups'}"
                                 class="nav-link"
                                 v-if="$root.currentUser.userAuthorities.includes('GET_USER')"
                    >Groups
                    </router-link>

                    <router-link :to="{name: 'Producers'}"
                                 class="nav-link"
                                 v-if="$root.currentUser.userAuthorities.includes('GET_USER')"
                    >Producers
                    </router-link>

                    <router-link :to="{name: 'Users'}"
                                 class="nav-link"
                                 v-if="$root.currentUser.userAuthorities.includes('GET_USER')"
                    >Users
                    </router-link>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                    <!--                    <b-nav-item-dropdown text="Lang" right>-->
                    <!--                        <b-dropdown-item href="#">EN</b-dropdown-item>-->
                    <!--                        <b-dropdown-item href="#">ES</b-dropdown-item>-->
                    <!--                        <b-dropdown-item href="#">RU</b-dropdown-item>-->
                    <!--                        <b-dropdown-item href="#">FA</b-dropdown-item>-->
                    <!--                    </b-nav-item-dropdown>-->

                    <b-nav-item-dropdown right v-if="$root.currentUser.username">
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <b>{{$root.currentUser.username}}</b>
                        </template>
                        <b-dropdown-item @click="$emit('sign-out')">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

        <loginForm/>
    </div>

</template>

<script>
    import loginForm from './LoginForm'

    export default {
        name: "Navbar",
        components: {
            loginForm
        }
    }
</script>

<style scoped>

</style>