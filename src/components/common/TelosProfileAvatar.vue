<template>
  <div v-if="avatar && !isError" :class="childClass">
    <q-avatar v-bind:size="size">
      <img @error="onError" v-bind:src="avatar" />
    </q-avatar>
  </div>
  <div v-else :class="childClass">
    <profile-avatar
      :size="size"
      :avatar="isError ? null : avatar"
      :account="account_name"
    />
  </div>
</template>

<script>
import { GET_TABLE_ROWS } from '../../pages/resolve/util/fetch';
import ProfileAvatar from 'src/pages/profiles/ProfileAvatar.vue';
import md5 from 'md5';

export default {
    name: 'TelosProfileAvatar',
    components: {
        ProfileAvatar,
    },
    props: ['account_name', 'size', 'childClass'],
    data() {
        return {
            isError: false,
            avatar: '',
            hash: md5(this.account_name || ''),
            styleClass: this.size
                ? { ...this.childClass, height: this.size, width: this.size }
                : this.childClass,
        };
    },
    methods: {
        onError() {
            console.log('Telos profile image load error');
            this.isError = true;
        },
    },
    async beforeMount() {
        try {
            const { rows } = await GET_TABLE_ROWS({
                code: 'profiles',
                scope: 'profiles',
                table: 'profiles',
                json: true,
                limit: 1,
                lower_bound: this.account_name,
                upper_bound: this.account_name,
            });
            const [profile] = rows;
            if (profile) {
                const { avatar } = profile;
                if (profile.account_name === this.account_name) {
                    if (avatar) {
                        this.avatar = avatar;
                    }
                }
            }
        } catch (err) {
            console.log('err: ', err);
        }
    },
};
</script>

<style scoped>
.profile-avatar {
  display: inline;
}
</style>
