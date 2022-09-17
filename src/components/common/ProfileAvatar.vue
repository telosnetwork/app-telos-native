<template>
  <div>
    <div v-if="avatar" :class="childClass">
      <q-avatar v-bind:size="size">
        <img v-bind:src="avatar" />
      </q-avatar>
    </div>
    <div v-else>
      <v-gravatar
        v-bind:hash="this.hash"
        :style="styleClass"
        class="q-avatar"
      />
    </div>
  </div>
</template>

<script>
import { GET_TABLE_ROWS } from "../../pages/resolve/util/fetch";
import md5 from "md5";

export default {
  props: ["account_name", "size", "childClass"],
  data() {
    return {
      avatar: "",
      hash: md5(this.account_name),
      styleClass: this.size
        ? { ...this.childClass, height: this.size, width: this.size }
        : this.childClass,
    };
  },
  async beforeMount() {
    try {
      const { rows } = await GET_TABLE_ROWS({
        code: "profiles",
        scope: "profiles",
        table: "profiles",
        json: true,
        limit: 1,
        lower_bound: this.account_name,
        upper_bound: this.account_name,
      });
      const [profile] = rows;
      if (profile) {
        const { avatar } = profile;
        if (avatar) {
          this.avatar = avatar;
        }
      }
    } catch (err) {
      console.log("err: ", err);
    }
  },
};
</script>

<style scoped>
.profile-avatar {
  display: inline;
}
</style>
