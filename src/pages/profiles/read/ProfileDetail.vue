<template lang="pug">
main.column.items-center.back
  q-card.my-card
    q-card-section
      .column.items-center
        profile-avatar(
          size="200px",
          :avatar="Profile ? Profile.avatar : null",
          :account="Profile ? Profile.account_name : null"
        )
    q-card-section
      .row.justify-center.q-gutter-x-md
        p.text-h4 {{ Profile ? Profile.account_name : $route.params.id }}
      .row.justify-center.q-gutter-x-md
        p.text-h6 {{ Profile?.status || $route.params.id }}
    q-card-section.q-mx-md
      q-list(padding, separator)
        q-item.q-mx-md
          q-item-section(top, thumbnail)
            q-icon(color="primary", name="account_circle")
          q-item-section
            q-item-label {{ $t('pages.general.name') }}
            q-item-label(caption) {{ fullName }}
        q-item.q-mx-md
          q-item-section(top, thumbnail)
            q-icon(color="primary", name="short_text")
          q-item-section
            q-item-label {{ $t('pages.signUp.form.presentation') }}
            //- q-item-label(caption) {{ this.Profile.bio }}
            q-item-label(caption, v-html="Profile?.bio")
        q-select(
          v-if="!$i18n.locale",
          filled,
          v-model="$i18n.locale",
          label="Language",
          :options="langs"
        )

    .row.justify-end(v-if="isOwner")
      .col-2.fab-edit
        q-btn(
          fab,
          icon="edit",
          color="primary",
          :to="`/profiles/edit/${Profile ? Profile.account_name : account}`"
        )
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ProfileAvatar from 'src/pages/profiles/ProfileAvatar.vue';
import SignUp from 'src/pages/profiles/add/SignUp.vue';
export default {
    name: 'ProfileDetail',
    components: {
        ProfileAvatar,
        SignUp,
    },
    computed: {
        ...mapGetters('accounts', ['account']),
        Profile() {
            if (this.isOwner) {
                return this.$store.state.profiles.myProfile;
            } else return this.$store.state.profiles.selectedProfile;
        },
        isOwner() {
            return this.account === this.$route.params.id;
        },
        missingProfile() {
            return this.isOwner && !this.$store.state.profiles.myProfile;
        },
        fullName() {
            return this.Profile ? this.Profile.display_name : this.account;
        },

    },
    async beforeMount() {
        try {
            this.showIsLoading(true);
            await this.getProfile();
        } catch (e) {
            console.log(e);
        }
        this.showIsLoading(false);
        if (this.missingProfile) {
            this.$router.push({ name: 'userRegister' });
        }
        this.$store.commit('profiles/setSelectedProfile', []);


    },

    methods: {
        ...mapActions('profiles', ['getProfile']),
    },
};
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 100%
  min-height: 100vh

.back
  background: rgba(255,255,255,.4)
  height: auto

.fab-edit
  margin-right: 25px
  margin-bottom: 10px

@media screen and (min-width: 500px)
  .my-card
    width: 100%
    max-width: 70%
    min-height: 90vh
    margin-top: 20px
    margin-bottom: 20px

  .fab-edit
    margin-right: 2px
</style>
