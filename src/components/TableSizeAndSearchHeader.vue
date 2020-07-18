<template>
    <div class="row py-2 justify-content-between">
        <div class="col-3 col-lg-2">
            <div class="col-12 col-sm-10 col-md-6 mx-0 px-0">
                <b-form-select
                        :options="sizePerPageOptions"
                        @change="$emit('on-size-per-page-changed', sizePerPage)"
                        v-model="sizePerPage"
                ></b-form-select>
            </div>
        </div>

        <div class="col-9 col-lg-5">
            <div class="float-right input-group">
                <input aria-label="Search"
                       class="form-control mr-2" id="input-user-search" placeholder="Name, username or email..."
                       type="search">
                <button class="btn btn-outline-success my-0" type="submit">Search</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableSizeAndSearchHeader",
        props: [
            'sizePerPageOptions'
        ],
        data() {
            return {
                sizePerPage: 5
            }
        }
    }
</script>

<style scoped>

</style>