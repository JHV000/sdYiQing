<template>
  <div class="home">
    <div id="main"></div>
    <div class="shandong">
      <p class="title">截止至 {{ month }}月{{ day }}日山东数据统计：</p>
      <ul>
        <li>
          <strong style="color: rgb(247, 76, 49);">{{ confirmedCount }}</strong>
          <span>确诊</span>
        </li>
        <li>
          <strong style="color: rgb(93, 112, 146);">{{ deadCount }}</strong>
          <span>死亡</span>
        </li>
        <li>
          <strong style="color: rgb(40, 183, 163);">{{ curedCount }}</strong>
          <span>治愈</span>
        </li>
      </ul>
    </div>
    <div class="china">
      <p class="title">截止至 {{ month }}月{{ day }}日全国数据统计：</p>
      <ul>
        <li>
          <strong style="color: rgb(247, 76, 49);">{{ totalConfirmCount }}</strong>
          <span>确诊</span>
        </li>
        <li>
          <strong style="color: rgb(247, 130, 7);">{{ totalMaybeCount }}</strong>
          <span>疑似</span>
        </li>
        <li>
          <strong style="color: rgb(162, 90, 78);">{{ toatlSeriousCunt }}</strong>
          <span>重症</span>
        </li>
        <li>
          <strong style="color: rgb(93, 112, 146);">{{ totalDeadCount }}</strong>
          <span>死亡</span>
        </li>
        <li>
          <strong style="color: rgb(40, 183, 163);">{{ totalCureCount }}</strong>
          <span>治愈</span>
        </li>
      </ul>
    </div>
    <div class="link">
      <a href="https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline">全国新冠肺炎疫情实时动态</a>
    </div>
    <div class="bottom">
      <p>山东理工大学学生工作部（处）、武装部 青春在线网站版权所有</p>
      <p></p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import echarts from "@/libs/echarts.min.js";
// 导入山东各市经纬度坐标
import sdMapData from "@/common/sortData.js";

let markdata = []; //
var date = new Date();
export default {
  data() {
    return {
      sDYiQingData: {},
      month: null,
      day: null,
      total: null,
      confirmedCount: null,
      curedCount: null,
      deadCount: null,
      totalConfirmCount: null,
      totalMaybeCount: null,
      toatlSeriousCunt: null,
      totalDeadCount: null,
      totalCureCount: null
    };
  },
  mounted() {
    this.getData2019nCoV();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
  },
  methods: {
    // 请求数据
    getData2019nCoV() {
      this.$axios.get("/getAllProvinceData2019nCoV").then(res => {
        if (res && res.data) {
          // 找到山东省数据
          this.sDYiQingData = res.data.find(item => {
            return item.locationId === 370000;
          });
          //得到总的统计人数
          this.confirmedCount = this.sDYiQingData.confirmedCount;
          this.curedCount = this.sDYiQingData.curedCount;
          this.deadCount = this.sDYiQingData.deadCount;
          // 整理marker点数据
          markdata = this.convertData(sdMapData.features);

          // 创建地图
          this.createMap(sdMapData);
        }
      });
      this.$axios.get("/getCountryData2019nCoV").then(res => {
        this.totalConfirmCount = res.data.confirmedCount;
        this.totalMaybeCount = res.data.suspectedCount;
        this.toatlSeriousCunt = res.data.seriousCount; 
        this.totalDeadCount = res.data.deadCount;
        this.totalCureCount = res.data.curedCount;
      });
    },
    createMap(data) {
      echarts.registerMap("demo", data);
      var chart = echarts.init(document.getElementById("main"));
      chart.setOption({
        title: {
          text: "山东省各市疫情分布图",
          subtext: "数据来自网络"
        },
        dataRange: {
          x: "right",
          y: "bottom",
          pieces: [
            {
              gt: 1,
              lte: 9,
              color: "#fdebcf"
            },
            {
              gt: 10,
              lte: 20,
              color: "#f59e83"
            },
            {
              gt: 20,
              lte: 39,
              color: "#e55a4e"
            },
            {
              gt: 40,
              lte: 59,
              color: "#cb2a2f"
            },
            {
              gt: 60,
              lte: 99,
              color: "#811c24"
            },
            {
              gt: 100,
              color: "#4f070d"
            }
          ],
          outOfRange: {
            color: "#eee"
          }
        },
        tooltip: {
          show: true,
          formatter: "确诊人数<br /> {b}: {c0}"
        },
        series: [
          {
            type: "map",
            map: "demo",
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            },
            data: markdata,
            markPoint: {
              symbolSize: 45,
              itemStyle: {
                normal: {
                  borderColor: "#33CBFF",
                  color: "#33CBFF",
                  borderWidth: 1, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: true
                  }
                }
              },
              data: markdata
            }
          }
        ]
      });
    },
    convertData(arrs) {
      var markdata = [];
      for (var i = 0; i < arrs.length; i++) {
        const areaData = this.sDYiQingData.cities.find(
          item => item.locationId === arrs[i].properties.adcode
        );

        // 只渲染有确诊的marker点
        // if (areaData) {
        markdata.push({
          coord: arrs[i].properties.center,
          name: arrs[i].properties.name,
          value: areaData ? areaData.confirmedCount : 0
        });
        // }
      }
      return markdata;
    }
  },

  components: {}
};
</script>
<style>
#main {
  width: 600px;
  height: 400px;
  margin: 30px auto;
}
.details {
  width: 600px;
  height: 150px;
  margin: 30px auto;
}
.china,
.shandong
 {
  width: 600px;
  margin: 30px auto;
}
.bottom {
  width: 600px;
  margin: 10px auto;
}
.shandong {
  margin-bottom: 80px;
}
.link {
  width: 600px;
  margin: 30px auto;
  text-align: center;
  text-decoration: none;
  margin-top: 80px;
}
a {
  color: #666;
}
ul {
  display: flex;
  height: 60px;
  padding: 0px;
  position: relative;
}
ul::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 1px;
  bottom: -15px;
  background-image: linear-gradient(180deg, #eee, #e1e1e1 51%, #fff);
}
strong {
  font-size: 20px;
}
li {
  list-style: none;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
li::after {
  position: absolute;
  right: 0;
  width: 1px;
  height: 40px;
  margin-top: 3px;
  background-image: linear-gradient(180deg, #eee, #e1e1e1 51%, #fff);
  content: "";
}
li:last-child::after {
  content: "";
  width: 0;
}
span {
  font-size: 15px;
  font-weight: 700;
}
.title {
  color: #666;
  font-size: 15px;
}
body {
  position: relative;
}
.bottom {
  text-align: center;
  position: absolute;
  bottom: -245px;
  left: 0;
  right: 0;
}
</style>
