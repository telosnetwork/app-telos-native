<template lang="pug">
profile-detail(owner=true)
</template>

<script>
import ProfileDetail from '~/pages/profiles/read/ProfileDetail';
import { mapActions } from 'vuex';
export default {
    name: 'MyProfile',
    components: { ProfileDetail },
    methods: {
        ...mapActions('profiles', ['getProfile']),
    },
};
</script>
