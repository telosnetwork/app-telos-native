<template>
    <a :href="hashLink" class="resolve-hash-link" target="_blank">{{ hash }}</a>
</template>

<script>
export default {
    props: ['hash'],
    computed: {
        hashLink() {
            return `https://api.dstor.cloud/ipfs/${this.hash}`;
        }
    }
};
</script>

<style>
.resolve-hash-link {
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 150px;
    display: inline-block;
}
</style>
