

<template>
  <div id="replay" ref="replay" v-if="isPlaying" />
  <input type="checkbox" placeholder="" />
  <button type="button" @click="handelStart">开始录制</button>
  <button type="button" @click="handelPasue">暂停</button>
  <button type="button" @click="handelRecord">回放</button>
  <button type="button" @click="handelRequest">请求</button>
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
const isPlaying = ref(false)
const isRecording = ref(false)
let stopFn = null
let replayInstance = null;
const handelStart = () => {
  isPlaying.value = false;
  isRecording.value = true;
  stopFn = rrweb.record({
    emit(event) {
      events.value.push(event)
      if (events.value.length >= 10) {
        uploadFile()
        events.value = []
      }
    },
  });
}
/**
 *  压缩 events 数据，并上传至后端
 *
 */
const uploadFile = () => {
  console.log("上传快照了");
  fetch('/apis/uploadFile', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
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
    if (replayInstance) return
    replayInstance = new rrwebPlayer({
      target: replay.value, // 可以自定义 DOM 元素
      // 配置项
      props: {
        events: events.value,
      },
    });
  }, 100);
}
const handelPasue = () => {
  isRecording.value = false
  stopFn()
  if (events.value.length === 0) return
  uploadFile();
  events.value = []
}
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
