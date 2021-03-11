<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="1">
            <v-text-field v-model="boxWidth" label="寬" required></v-text-field>
          </v-col>
          <v-col cols="12" md="1">
            <v-text-field
              v-model="boxHeight"
              label="長"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1">
            <v-text-field
              v-model="tempRownum"
              :rules="numRules"
              label="行數"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="1">
            <v-text-field
              v-model="tempColnum"
              :rules="numRules"
              label="單行個數"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-btn @click="generated">生成</v-btn>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn-toggle v-model="toggle">
              <v-btn value="cursor" @click="cursorSelect">
                <v-icon>mdi-cursor-default-outline</v-icon>
              </v-btn>
              <v-btn value="select" @click="selectDrag">
                <v-icon>mdi-select-drag</v-icon>
              </v-btn>
              <v-btn value="move" @click="cursorMove">
                <v-icon>mdi-cursor-move</v-icon>
              </v-btn>
              <v-btn value="expand" disabled>
                <v-icon>mdi-arrow-expand</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-stage id="stage" :config="stageKonva" @mousedown="selectedRectCreate">
      <v-layer>
        <v-group ref="gg" :config="{ draggable: true }"></v-group>
        <v-rect
          v-for="item in layout"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            width: boxWidth,
            height: boxHeight,
            id: item.id,
            fill: item.color,
          }"
        ></v-rect>
        <v-rect id="selectRectBox" :config="selectRect"> </v-rect>
        <v-transformer
          ref="transformer"
          :config="{ resizeEnabled: false, rotateEnabled: false }"
        />
      </v-layer>
    </v-stage>
    <v-card>
      <v-card-title>
        <v-btn @click="save">存檔</v-btn>
      </v-card-title>
      <v-card-text>
        {{ tempLayout }}
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
const width = window.innerWidth;
function haveIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export default {
  data: () => ({
    stageKonva: {
      width: width,
      height: 500,
    },
    allnum: 12,
    colnum: 6,
    rownum: 2,
    tempColnum: 5,
    tempRownum: 4,
    boxHeight: 150,
    boxWidth: 50,
    layout: [
      { x: 0, y: 0, id: 0, color: "blue" },
      { x: 55, y: 0, id: 1, color: "blue" },
      { x: 110, y: 0, id: 2, color: "blue" },
      { x: 165, y: 0, id: 3, color: "blue" },
      { x: 220, y: 0, id: 4, color: "blue" },
      { x: 0, y: 155, id: 5, color: "blue" },
      { x: 55, y: 155, id: 6, color: "blue" },
      { x: 110, y: 155, id: 7, color: "blue" },
      { x: 165, y: 155, id: 8, color: "blue" },
      { x: 220, y: 155, id: 9, color: "blue" },
      { x: 0, y: 310, id: 10, color: "blue" },
      { x: 55, y: 310, id: 11, color: "blue" },
      { x: 110, y: 310, id: 12, color: "blue" },
      { x: 165, y: 310, id: 13, color: "blue" },
      { x: 220, y: 310, id: 14, color: "blue" },
      { x: 0, y: 465, id: 15, color: "blue" },
      { x: 55, y: 465, id: 16, color: "blue" },
      { x: 110, y: 465, id: 17, color: "blue" },
      { x: 165, y: 465, id: 18, color: "blue" },
      { x: 220, y: 465, id: 19, color: "blue" },
    ],
    tempLayout: [],
    numRules: [(v) => !!v || "Name is required"],
    dragItemId: null,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    selectRect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      opacity: 0,
      fill: "pink",
    },
    isMouseDown: false,
    selectTemp: [],
    toggle:"cursor"
  }),
  methods: {
    generated() {
      this.tempLayout = [];
      this.colnum = this.tempColnum;
      this.rownum = this.tempRownum; 
      for (var i = 0; i < this.rownum; i++) {
        for (var j = 0; j < this.colnum; j++) {
          this.tempLayout.push({
            x: j * (this.boxWidth + 5),
            y: i * (this.boxHeight + 5),
            id: this.colnum * i + j,
            color: "blue",
          });
        }
      }

      this.save();
    },
    load() {
      const data = localStorage.getItem("storage") || "[]";
      this.layout = JSON.parse(data);
    },
    save() {
      this.layout = this.tempLayout;
      localStorage.setItem("storage", JSON.stringify(this.layout));
    },
    selectedRectCreate(e) { 
      const stage = e.target.getStage();
      const transformerNode = this.$refs.transformer.getNode();

      this.x1 = stage.getPointerPosition().x;
      this.y1 = stage.getPointerPosition().y;

      stage.on("mousemove", (evt) => {
        if (!this.isMouseDown) return false;
        this.x2 = evt.evt.clientX;
        this.y2 = evt.evt.clientY;
        this.selectRect.x = Math.min(this.x1, this.x2);
        this.selectRect.y = Math.min(this.y1, this.y2);
        this.selectRect.width = Math.abs(this.x1 - this.x2);
        this.selectRect.height = Math.abs(this.y1 - this.y2);
        this.selectRect.opacity = 0.3;
      });

      document.onmouseup = (e) => {
        this.selectAction(stage);
        transformerNode.nodes(this.selectTemp);
        this.selectRect.opacity = 0;
        this.isMouseDown = false;
        this.selectTemp = [];
      };
    },
    selectAction(stage) {

      var sharps = stage.find((e) => e.className == "Rect").toArray();
      var box = {
        x: this.selectRect.x,
        y: this.selectRect.y,
        width: this.selectRect.width,
        height: this.selectRect.height,
      };

      var selected = sharps.filter((s) => {
        if (
          haveIntersection(box, s.getClientRect()) &&
          s.attrs.id != "selectRectBox"
        ) {
          s.setAttrs({
            fill: "pink",
          });
          return true;
        } else {
          s.setAttrs({
            fill: "blue",
          });
          return false;
        }
      });
      this.selectTemp = selected;
    },
    selectDrag() {
      document.getElementById("stage").style.cursor = "crosshair";
      this.isMouseDown = true;
    },
    cursorSelect() {
      document.getElementById("stage").style.cursor = "default";
      this.isMouseDown = false;
    },
    cursorMove() {
      document.getElementById("stage").style.cursor = "move";
      this.isMouseDown = false;
      this.selectTemp.forEach((s)=>{
        s.setAttr("draggable", "true");        
      });
    },
  },
  mounted() {
    //this.load();
  },
};
</script>