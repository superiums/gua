<template>
  <v-app>
    <!-- app-bar -->
    <div class="bg">
      <v-app-bar color="lime darken-4" dark>
        <v-toolbar-title>{{ prop.config.siteName }}</v-toolbar-title>
      </v-app-bar>
    </div>

    <!-- content -->
    <v-content class="bg">
      <!-- <HelloWorld/> -->
      <transition name="slide-fade">
        <Home @notify="showMsg" />
      </transition>
      <!-- msg -->
      <v-snackbar v-model="showMsg">{{msg}}</v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import Home from "./views/Home";
// import myTabs from "@/components/myTabs.vue";

export default {
  name: "App",
  components: {
    Home
    //   myTabs
  },
  data: () => ({
    showMsg: false,
    msg: null
    // searchSite:null
  })
};
</script>

<style>
body,
.bg {
  background-color: #242526f2;
}
.appView {
  position: absolute;
  width: 100%;
  transition: transform 0.5s ease-out;
}
.slide-left-enter {
  transform: translate(100%, 0);
}
.slide-left-leave-active {
  transform: translate(-50%, 0);
}
.slide-right-enter {
  transform: translate(-50%, 0);
}
.slide-right-leave-active {
  transform: translate(100%, 0);
}
</style>