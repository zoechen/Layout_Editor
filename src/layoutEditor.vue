<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="allnum"
              disabled
              label="總數"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="rownum"
              :rules="numRules"
              label="行數"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="colnum"
              :rules="numRules"
              label="單行個數"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-btn @click="generated">生成</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-card>
      <grid-layout
        :layout.sync="tempLayout"
        :col-num="colnum"
        :row-height="rowHeight"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        @layout-updated="layoutBeforeMountEvent"
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="1"
          :h="1"
          :id="item.i"
          :key="item.i"
          class="grid"
        >
          {{ item.i }}
        </grid-item>
      </grid-layout>
    </v-card>
    <v-card>
      <v-card-title>
        <v-btn @click="onSave">存檔</v-btn>
      </v-card-title>
      <v-card-text>
        {{ tempLayout }}
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import VueGridLayout from "vue-grid-layout";

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  data: () => ({
    allnum: 12,
    colnum: 6,
    rownum: 2,
    rowHeight: 160,
    layout: [],
    tempLayout: [],
    numRules: [(v) => !!v || "Name is required"],
  }),
  methods: {
    generated() {
      this.tempLayout = [];
      this.allnum = this.colnum * this.rownum;
      for (var i = 0; i < this.allnum; i++) {
        this.tempLayout.push({
          x: i % (this.colnum || this.allnum),
          y: Math.floor(i / this.colnum), 
          color:"blue",
          id: i + 1,
        });
      }

      this.layoutBeforeMountEvent();
    },
    layoutBeforeMountEvent() {
      this.layout = this.tempLayout;
    },
    redoStep() {
      this.$refs.editor.redo();
    },
    onSave() {
     
    }, 
  },
  mounted() {
  
  },
};
</script>
<style>
.grid {
  background: #fa0;
}
</style>