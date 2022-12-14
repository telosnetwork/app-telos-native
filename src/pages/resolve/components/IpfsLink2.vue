<template>
    <a :href="hashLink" class="resolve-hash-link" target="_blank">{{
        hash.substring(0, this.length || 8)
    }}</a>
</template>

<script>
export default {
    props: ['hash', 'length', 'ellipsis'],
    computed: {
        hashLink() {
            return `https://api.dstor.cloud/ipfs/${this.hash}`;
        }
    }
};
</script>

<style scoped>
.resolve-hash-link {
    text-decoration: underline;
    font-weight: bold;
    color: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
