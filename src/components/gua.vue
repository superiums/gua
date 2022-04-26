<template>
  <div class="guacontainer">
    <v-text-field
      label="编码"
      type="number"
      v-model="gua"
      style="display:inline-block"
      clearable
      class="codeTxt text-center"
      @change="doSetToCustom"
    ></v-text-field>

    <div class="gua">
      <div
        v-for="(p,i) in posi"
        :key="i"
        class="yao"
        :class="{'yin':yao(p)==0}"
        :value="yao(p)"
        @click="switchYao(p)"
      >
        <div class="gap"></div>
      </div>

    </div>
    <!-- detail -->
    <!-- <div v-html="yiText" /> -->
    <v-row justify="center">
      <v-dialog dark scrollable v-model="dialog">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" outlined dark v-on="on" @click="openGuaText">{{fullName }}</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{fullName }}</span>
          </v-card-title>
          <v-divider />
          <v-switch v-model="showSC" class="ma-2" label="转为简体" @change="openGuaText"></v-switch>
          <v-card-text v-html="yiText" class="yit"></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn block dark text @click="dialog = false">返回</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- menu -->
    <template>
      <span class="text-center">
        <!-- <v-chip x-small label class="ma-1">{{commit?'[本]':opts[type]}}</v-chip> -->
        <v-menu offset-y offset-overflow>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" tile text v-on="on" small>{{commit?'[本]':opts[type]}}</v-btn>
          </template>
          <v-list dark>
            <v-list-item-group v-model="type" color="primary">
              <v-list-item
                v-for="(item, index) in opts"
                :key="index"
                :inactive="false"
                @click="doOpt(index)"
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </span>
    </template>
    <!-- search -->
    <template>
      <v-dialog dark  v-model="dialogSearch" max-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark tile text v-on="on" x-small>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>搜索</v-card-title>
          <v-card-text>
            <v-text-field label="搜索 卦名或周易卦序(1-64)" v-model="key"></v-text-field>
          </v-card-text>

          <v-btn color="blue darken-1" @click="doSearch" block>搜索</v-btn>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>
<script>
import Gprop from '../router/properties_gua'
export default {
  props: {
    initGua: Number,
    commit: Boolean
  },
  data: () => {
    return {
      posi: [0b100000, 0b010000, 0b001000, 0b000100, 0b000010, 0b000001],
      gua: 0b111111,
      // guaFile: null
      // fullName:null
      yiText: null,
      dialog: false,
      dialogSearch: false,
      showSC: false,
      opts: ["本卦", "互卦", "错卦", "综卦", "前卦", "后卦", "自定"],
      key: null,
      type: 0
    };
  },
  computed: {
    yao: () => {
      return function(i) {
        return this.gua & i;
      };
    },
    fullName: function() {
      return this.getGuaFullName();
    }
  },
  methods: {
    switchYao: function(i) {
      this.gua ^= i;
      // this.fullName=this.getGuaFullName();

      this.doSetToCustom(); //自定义
    },
    getGuaFullName: function() {
      return Gprop.guaFullName[parseInt(this.gua)];
    },
    openGuaText: function() {
      this.yiText = this.readGuaText();
    },
    readGuaText: function() {
      if (this.showSC) {
        return Gprop.t2s(Gprop.zhouyi[this.gua].d);
      } else return Gprop.zhouyi[this.gua].d;
    },
    doOpt: function(index) {
      this.gua = this.dogetOptResult(index);
    },
    dogetOptResult: function(index) {
      switch (index) {
        case 0:
          return this.initGua;
        case 1: {
          // 互卦
          let up, down;
          if (this.initGua == 0 || this.initGua == 0b111111) {
            // 乾坤互卦根据变卦取
            // up = (this.bianGua >> 2) & 0b111; // 3,4,5爻
            // down = (this.bianGua >> 1) & 0b111; // 2,3,4爻
            this.$emit("notify", "乾坤二卦根据变卦取互卦.请变第一卦后重试.");
            return this.gua;
          } else {
            up = (this.initGua >> 2) & 0b111; // 3,4,5爻
            down = (this.initGua >> 1) & 0b111; // 2,3,4爻
          }
          return getGuaOne(up, down);
        }
        case 2: {
          // 错卦
          let up = (this.initGua >> 3) ^ 0b111; // 本卦的高三位取反
          let down = (this.initGua & 0b111) ^ 0b111; // 本卦的低三位取反
          return getGuaOne(up, down);
        }
        case 3: {
          // 综卦
          let zong = reverse(this.initGua); // 整体反转
          let up = zong >> 3; // 高三位
          let down = zong & 0b111; // 低三位
          return getGuaOne(up, down);
        }
        case 4: {
          let guaxu = Gprop.zhouyiGuas.indexOf(this.gua);
          let prexu = guaxu <= 0 ? 63 : guaxu - 1;
          return Gprop.zhouyiGuas[prexu];
        }
        case 5: {
          let guaxu = Gprop.zhouyiGuas.indexOf(this.gua);
          let nextxu = guaxu >= 63 ? 0 : guaxu + 1;
          return Gprop.zhouyiGuas[nextxu];
        }
        default:
          return this.gua;
      }
      function getGuaOne(up, down) {
        return (up << 3) | down;
      }
      function reverse(n) {
        let r = 0; // 反转的结果
        for (let i = 0; i < 6; i++) {
          //		while (n != 0) { // 直到a==0，不然一直进行移位
          // 或运算将n的最低位保存到r中，同时r左移一位，
          // 保证上次的移位结果向左移动，新的需要保存的移位结果一直在r的最低位中
          r = (r << 1) | (n & 1);
          n = n >> 1; // n右移一位
        }
        return r;
      }
    },
    doSearch: function() {
      let n = parseInt(this.key);
      if (isNaN(n)) {
        let x = Gprop.guaName.indexOf(this.key);
        if (x < 0) {
          x = Gprop.guaNameT.indexOf(this.key);
        }
        if (x >= 0) {
          this.gua = x;
          this.doSetToCustom(); //自定义
        } else {
          this.$emit("notify", "并未找到,请检查输入.");
        }
      } else {
        if (n <= 0) n = 64;
        else if (n > 64) n = 0;
        else n -= 1;
        this.gua = Gprop.zhouyiGuas[n];
        this.doSetToCustom(); //自定义
      }
      this.key = null;
      this.dialogSearch = false;
    },
    doSetToCustom: function() {
      this.type = 6; //自定义
    }
  },
  mounted: () => {
    // this.getGuaFullName();
    // this.gua = this.initGua;
  },
  watch: {
    initGua: function(newVar, oldVar) {
      // console.log("initGua changed. dog.");
      if (!this.commit) {
        // console.log("  reOpt");
        this.doOpt(this.type);
      }
    },
    gua: function(newVar, oldVar) {
      if (this.commit) {
        // console.log("commminting...", newVar, typeof newVar);
        let x = parseInt(newVar);
        if (!isNaN(x)) this.$emit("guaChanged", x);
      }
    }
  }
};
</script>


<style >
.guacontainer {
  display: inline-block;
  background-color: #ccc;
  text-align: center;
  max-width: 120px;
  padding: 8px;
}
.codeTxt{
  max-width:80px;
}
.gua {
  padding: 5px;
  width: 100px;
  text-align: center;
}
.yao {
  margin: 10px 10px;
  width: 70px;
  height: 10px;
  background: #444;
  color: #fff;
  position: relative;
}
.yin .gap {
  margin: 0 auto;
  width: 10px;
  height: 10px;
  background-color: #ccc;
}

.yit .heavy {
  color: #abf1a3;
}
.yit h2 {
  padding: 20px;
}

.yit h2 + p {
  color: #a3ea87;
  font-size: medium;
}
.yit .h2note {
  margin-left: 0.58in;
  border-style: none none none solid;
  border-width: 0px 0px 0px 10px;
  border-color: blue #4a4a45;
  font-size: 90%;
  padding: 5px 5px 5px 5px;
}
.yit .g {
  font-family: "ht", "zw";
  color: #bcbcec;
  font-size: 24px;
  letter-spacing: 10px;
}
</style>