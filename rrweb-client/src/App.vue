

<template>
  <div id="replay" ref="replay" v-if="isPlaying" />
  <textarea placeholder-class="textarea-placeholder" />
  <button type="button" @click="handelStart">开始录制</button>
  <button type="button" @click="handelPasue">暂停</button>
  <button type="button" @click="handelRecord">回放</button>
  <button type="button" @click="handelReRecord">网络回放</button>
  <button type="button" @click="handelRequest">请求</button>
  <button type="button" @click="handelPayStart">支付开始</button>
  <button type="button" @click="handelPayEnd">支付结束</button>
  <div class="modal rr-mask" v-if="isRecording">正在录制</div>
</template>
<script setup>
import * as rrweb from 'rrweb';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import { ref, onUnmounted } from 'vue';
import axios from "axios";
const events = ref([])
const replay = ref()
/**是否正在回放 */
const isPlaying = ref(false)
/**是否正在录制 */
const isRecording = ref(false)
let stopFn = null
let replayInstance = null;
const handelStart = () => {
  isPlaying.value = false;
  isRecording.value = true;
  events.value = []
  stopFn = rrweb.record({
    emit(event) {
      // 用任意方式存储 event
      events.value.push(event)
      // 以 rrwebEvents 的长度作为分片持续上传 防止数据过大
      if (events.value.length >= 100) {
        //超过100 上传给后台 同事重置为空
        uploadFile()
        events.value = []
      }
    },
  });
}
const handelPayStart =() =>{
  rrweb.record.addCustomEvent('pay', {
        text: '正在支付中...',
        status: 'start'
    })
}
const handelPayEnd =() =>{
  rrweb.record.addCustomEvent('pay', {
        status: 'end'
    })
}
/**
 *  压缩 events 数据，并上传至后端
 *
 */
const uploadFile = () => {
  console.log("上传快照了");
  axios('/apis/uploadFile', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: JSON.stringify({
      events: events.value
    })
  })
    .then(response => {
      console.log('response', response)
    })
    .catch(error => {
      console.log('error', error)
    })
}

const handelRecord = () => {
  if (isRecording.value) {
    console.log("请先暂停录制");
    return
  }
  isPlaying.value = true
  //为了获取到replay dom
  setTimeout(() => {
    replayInstance = new rrwebPlayer({
      target: replay.value, // 可以自定义 DOM 元素
      // 配置项
      props: {
        events: events.value,
        skipInactive:false,	//是否快速跳过无用户操作的阶段
        showDebug: false, //是否在回放过程中打印 debug 信息
        showWarning: false, //是否在回放过程中打印警告信息
        autoPlay: true, //是否自动播放
        showControlle :true,	 //是否显示播放器控制 UI
        speedOption:[1, 2, 4, 8] //倍速播放可选值
      },
    });
    replayInstance.addEventListener("finish", (payload) => {
      console.log(payload,2222);
    })
  }, 100);
}
/**暂停录屏且上传 */
const handelPasue = () => {
  isRecording.value = false
  stopFn()
  if (events.value.length === 0) return
  uploadFile();
  events.value = []
}
/**网络请求回放 */
const handelReRecord = () => {
  axios('/apis/getFile', {
    method: 'post'
  })
    .then(res => {
      if (res.data.code == 200) {
        let { data = [] } = res.data
        if (data.length) {
          events.value = data;
          // replayInstance.destroy()
          // replayInstance = null
          handelRecord()
        }
      }
    })
    .catch(error => {
      console.log('error', error)
    })
}
/**测试服务器 */
const handelRequest = () => {
  axios('/apis/count', {
    method: 'get',
  })
    .then(response => {
      console.log('response', response)
    })
    .catch(error => {
      console.log('error', error)
    })
}
onUnmounted(() => {
  stopFn && stopFn() && (stopFn = null)
  replayInstance = null
})
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

input[type="checkbox"] {
  height: 16px;
  width: 16px;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.modal {
  position: fixed;
  top: 100px;
  left: 60px;
  padding: 10px;
  color: #333;
  border: 2px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
