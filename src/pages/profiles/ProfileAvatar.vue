<template lang="pug">
q-avatar(:size='size')
    img(v-if='avatar' :src='avatar')
    vue-gravatar(v-if='!avatar' :hash='accountHash' defaultImage='retro')
</template>

<script>
import md5 from 'md5';
import VueGravatar from 'src/components/VueGravatar.vue';
export default {
    name: 'ProfileAvatar',
    components: {
        VueGravatar,
    },
    props: {
        size: String,
        avatar: String,
        account: String
    },
    computed: {
        accountHash() {
            return md5(this.account || '');
        },
    }
};
</script>