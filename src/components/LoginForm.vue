<template>
    <div>
        <b-modal centered hide-footer id="loginModal" no-close-on-backdrop title="Login">

            <b-form
                    @submit.prevent="onSubmit"
                    class="px-2">

                <div class="row p-2">
                    <div class="col ">
                        <b-input
                                autofocus
                                class=""
                                id="user-username-input"
                                placeholder="Username"
                                required
                                v-model="form.username"
                        ></b-input>

                    </div>
                </div>

                <div class="row p-2">
                    <div class="col ">
                        <b-input-group class="">
                            <b-input
                                    class=""
                                    id="user-password-input"
                                    placeholder="Password"
                                    required
                                    type="password"
                                    v-model="form.password"
                            ></b-input>
                        </b-input-group>
                    </div>
                </div>

                <div class="row p-2 pr-0">
                    <div class="col">
                        <div class="float-right ">
                            <b-button
                                    class="" type="submit" variant="success"
                            >Login
                            </b-button>
                        </div>
                    </div>
                </div>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
    const axios = require('axios');

    export default {
        name: "LoginForm",
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            onSubmit() {
                axios.post('http://localhost:8080/login', {
                    "username": this.form.username,
                    "password": this.form.password
                }).then(response => {
                    let authorizationToken = 'Barrier ' + response.headers['authorization']
                    localStorage.setItem("authorizationToken", authorizationToken)

                    this.$root.currentUser = response.data
                    localStorage.setItem("currentUser", JSON.stringify(this.$root.currentUser))

                    this.$root.messageBoxOk("Updated", "Successful login!")
                    this.$bvModal.hide('loginModal')

                    if (this.$route.path !== '/') {
                        this.$router.push('/')
                        this.$router.go(0)
                    } else this.$router.go(0)
                }).catch(error => {
                    this.$root.messageBoxOk("Updated",
                        "Login unsuccessfully. ( " + error + ')', 'danger')
                });
            },
        }
    }
</script>

<style scoped>

</style>