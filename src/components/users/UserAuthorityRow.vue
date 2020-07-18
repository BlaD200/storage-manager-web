<template>
    <tr class="d-flex">
        <th class=" col-2 col-sm-2" scope="row">{{ authority.id }}</th>
        <td class=" col-7 col-sm-7" v-bind:class="{disabledAuthority: !isActive}">{{ authority.name }}</td>
        <td class=" col col-sm">
            <toggle-button
                    :disabled="isDisabled"
                    :color="{checked: '#28A745', unchecked: '#DC3545'}"
                    ref="toggleButton"
                    :font-size="14"
                    :height="30"
                    :labels="{checked: 'Grant', unchecked: 'Deny'}"
                    :sync="true"
                    :width="80"
                    class="ml-n2 ml-sm"
                    v-model="isActive"
            />
        </td>
    </tr>
</template>

<script>
    export default {
        name: "UserAuthorityRow",
        props: [
            'authority'
        ],
        computed: {
            isActive: {
                get() {
                    return this.authority.isActive
                },
                set(newVal) {
                    this.$emit('authority-changed', {name: this.authority.name, isActive: newVal})
                }
            },
            setUserAuthorities() {
                return this.$root.currentUser.userAuthorities.includes('SET_USER_AUTHORITIES')
            },
            isDisabled() {
                return ((this.$root.currentUser.id === parseInt(this.$route.params.id)) &&
                    (this.authority.name === 'SET_USER_AUTHORITIES' || this.authority.name.includes('GET')) ||
                    !this.setUserAuthorities)
            }
        }
    }
</script>

<style scoped>
    .disabledAuthority {
        text-decoration: line-through;
        font-style: italic;
    }
</style>