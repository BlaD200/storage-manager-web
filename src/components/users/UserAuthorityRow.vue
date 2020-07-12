<template>
    <tr class="d-flex">
        <th class=" col-2 col-sm-2" scope="row">{{ authority.index }}</th>
        <td class=" col-7 col-sm-7" v-bind:class="{disabledAuthority: !isActive}">{{ authority.name }}</td>
        <td class=" col col-sm">
            <toggle-button
                    :color="{checked: '#28A745', unchecked: '#DC3545'}"
                    :disabled="
                        ($root.currentUser.id === $route.params.id) &&
                        (authority.name === 'SET_USER_AUTHORITIES' || authority.name.includes('GET') ||
                        !$parent.setUserAuthorities)"
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