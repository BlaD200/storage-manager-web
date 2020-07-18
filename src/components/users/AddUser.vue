<template>
    <div>
        <b-form
                :title="!createUserAuthority ?
                                    'You haven\'t rights to add new user' : ''" @reset="onReset"
                @submit.prevent="onSubmit"
                v-b-tooltip.hover.bottom
                v-if="show">

            <div class="row justify-content-center">
                <div class="col-sm-6 col-md-3">
                    <b-input
                            :disabled="!createUserAuthority"
                            class="mb-2 mr-sm-2 mb-sm-2 "
                            id="user-username-input"
                            placeholder="Username"
                            required
                            v-model="form.username"
                    ></b-input>

                </div>
                <!--            <b-form-invalid-feedback :state="validation">-->
                <!--                Your user ID must be 5-12 characters long.-->
                <!--            </b-form-invalid-feedback>-->

                <div class="col-sm-6 col-md-3">
                    <b-input
                            :disabled="!createUserAuthority"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            id="user-password-input"
                            placeholder="Password"
                            required
                            type="password"
                            v-model="form.password"
                    ></b-input>
                </div>
            </div>

            <div class="row justify-content-center">

                <div class="col-sm-6 col-md-3">
                    <b-input
                            :disabled="!createUserAuthority"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            placeholder="Name"
                            required
                            v-model="form.name"
                    ></b-input>
                </div>

                <div class="col-sm-6 col-md-3">
                    <b-form-input
                            :disabled="!createUserAuthority"
                            class="mb-2 mr-sm-2 mb-sm-2 "
                            id="user-surname-input"
                            placeholder="Surname"
                            required
                            v-model="form.surname"
                    ></b-form-input>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-sm-12 col-md-6">
                    <b-form-input
                            :disabled="!createUserAuthority"
                            class="mb-2 mr-sm-2 mb-sm-2 "
                            placeholder="Email"
                            required
                            type="email"
                            v-model="form.email"
                    ></b-form-input>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-sm-12 col-md-6">
                    <div class="float-right mt-2 mt-sm-2 mt-md-1 mx-sm-0 mx-md-1">
                        <b-button
                                :disabled="!createUserAuthority || !isChanged"
                                :title="createUserAuthority ?
                                    'Create new user' : ''" class="mx-2"
                                type="submit" v-b-tooltip.hover.bottom variant="success">Add user
                        </b-button>
                        <b-button
                                :disabled="!createUserAuthority || !isChanged"
                                class="ml-2 mr-md-n1" type="reset" variant="outline-secondary">Reset
                        </b-button>
                    </div>
                </div>
            </div>

        </b-form>
    </div>
</template>

<script>
    export default {
        name: "AddUser",
        data() {
            return {
                form: {
                    email: '',
                    username: '',
                    password: '',
                    name: '',
                    surname: ''
                },
                show: true
            }
        },
        methods: {
            onSubmit() {
                this.$emit('add-user', this.form)
                this.onReset()
            },
            onReset() {
                // Reset our form values
                this.form.email = ''
                this.form.username = ''
                this.form.password = ''
                this.form.name = ''
                this.form.surname = ''
                // Trick to reset/clear native browser form validation state
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            }
        },
        computed: {
            createUserAuthority() {
                return this.$root.currentUser.userAuthorities.includes('CREATE_USER')
            },
            isChanged() {
                return this.form.email !== '' ||
                    this.form.username !== '' ||
                    this.form.password !== '' ||
                    this.form.name !== '' ||
                    this.form.surname !== ''
            }
        }
    }
</script>

<style scoped>

</style>