<template lang="pug">
main
  sign-up-form
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import SignUpForm from '~/pages/profiles/add/SignUpForm';
export default {
    name: 'SignUp',
    components: { SignUpForm },
};
</script>
