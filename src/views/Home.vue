<template>
  <div id="home" class="home">
    <v-slider dark v-model="count" min="1" max="6" :label="countLabel" class="slider ma-2 pa-2" />
    <div class="d-flex flex-row justify-md-space-around flex-wrap ma-3">
      <v-card v-for="e in count" :key="e" tile class="mb-4 ml-2">
        <gua :initGua="initGua" :commit="e==1" @guaChanged="changeGua" @notify="showError" />
      </v-card>
    </div>

    <v-divider />
    <div class="text-center pa-4">
      <v-chip color="light-green darken-4" dark>坐看红尘飞,舞姿常寂然</v-chip>
    </div>
    <!-- msg -->
    <v-snackbar v-model="showMsg">{{msg}}</v-snackbar>
  </div>
</template>

<script>
import gua from "../components/gua";
export default {
  name: "home",
  data: function() {
    return {
      count: 2,
      initGua: null,
      showMsg: false,
      msg: null
    };
  },
  computed: {
    countLabel: function() {
      return "同时看" + this.count + "个";
    }
  },
  methods: {
    changeGua: function(e) {
      console.log("onchangegua", e);
      this.initGua = e;
    },
    showError(msg, error) {
      this.msg = msg + (error ? ":" + error.message : "");
      this.showMsg = true;
    }
  },
  components: {
    gua
  }
};
</script>

<style scoped>
.slider {
  max-width: 300px;
}
</style>
