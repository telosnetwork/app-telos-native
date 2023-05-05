<template lang="pug">
.fixed-center.text-center
  p.text-faded
    | Sorry, nothing here...
    strong (404)
  q-btn(color='secondary', to='/', label='Go back')
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Page404',
};
</script>
