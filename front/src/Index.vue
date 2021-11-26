<template>
  <div class="shoutbox">
    <command-form v-if="!sessionName" service="sessionName" action="setMySessionName" v-slot="{ data }"
                  class="nameForm">
      <input type="text" placeholder="Enter yout name..." v-model="data.name" />
      <button type="submit">Save</button>
    </command-form>
    <command-form v-else service="shoutBox" action="postMessage" reset-on-done v-slot="{ data }"
                  class="messageForm">
      <span class="userName" @click="resetName">{{ sessionName.name }}</span>
      <input type="text" class="messageInput" placeholder="Write message..." v-model="data.text" />
      <button type="submit">Send!</button>
    </command-form>
    <div class="messages">
      <scroll-border placement="top"
                     :load="messagesBuckets.loadTop"
                     :canLoad="messagesBuckets.canLoadTop"
                     :drop="messagesBuckets.dropTop" />
      <div v-for="(bucket, bucketIndex) in messagesBuckets.buckets">
        <div v-for="(message, index) in bucket.data" :key="message.id" :ref="el => bucket.domElements[index] = el"
             class="message">
          <div class="messageAuthor">
            {{ message.sessionName?.name }}
          </div>
          <p class="messageText">{{ message.text }}</p>
        </div>
      </div>
      <scroll-border placement="bottom"
                     :load="messagesBuckets.loadBottom"
                     :canLoad="messagesBuckets.canLoadBottom"
                     :drop="messagesBuckets.dropBottom" />
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { path, live, actions, api, rangeBuckets, reverseRange } from '@live-change/vue3-ssr'
import ScrollBorder from 'vue3-scroll-border'

const services = api().metadata.api.services

const workingZone = inject('workingZone')
const resetSessionName = actions().sessionName.resetMySessionName

const [ sessionName, messagesBuckets ] = await Promise.all([
  live(
      path().sessionName.mySessionName()
  ),
  rangeBuckets((range, p) =>
      p.shoutBox.messagesByTimestamp(reverseRange(range))
          .with(msg => p.sessionName.sessionOwnedName({
            session: msg.session.$nonEmpty()
          }).bind('sessionName'))
  )
])

// const messages = computed(() => buckets.buckets.flatMap(b=> b?.data || []))

function resetName() {
  workingZone.addPromise('delete name', resetSessionName())
}

</script>

<style>
  .shoutbox {
    display: flex;
    flex-direction: column;
  }
  form {
    display: flex;
  }
  input[type=text] {
    padding: 5px;
    border: 1px solid gray;
    border-radius: 3px;
  }
  .messageInput {
    flex-grow: 1;
  }
  button {
    margin-left: 4px;
    border: none;
    border-radius: 3px;
    background: lightgreen;
    cursor: pointer;
  }
  .messages {
    margin-top: 5px;
    flex-grow: 1;
    overflow-y: auto;
  }
  .message {
    margin: 2px;
    padding: 5px 10px;
    border-radius: 10px;
    border-bottom: 1px solid #80FFB0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .messageAuthor {
    margin-right: 7px;
    font-weight: bold;
  }
  .messageText {
    margin: 2px;
  }
  .userName {
    vertical-align: center;
    padding: 4px;
    cursor: not-allowed;
  }
</style>
