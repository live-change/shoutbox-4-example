<template>
  <div class="shoutbox">
    <command-form v-if="!sessionName" service="sessionName" action="setSessionName" v-slot="{ data }"
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
      <scroll-loader :what="range => $views.shoutBox.messagesByTimestamp($api.reverseRange(range))"
        v-slot:default="{ row: message, rows }" debugLog>
        <div class="message">
          <observe :what="$views.sessionName.publicSessionName({ session: message.session })"
            v-slot="{ value: authorName }">
            <div class="messageAuthor">
              {{ authorName?.name }}
            </div>
          </observe>
          <p class="messageText">{{ message.text }}</p>
        </div>
      </scroll-loader>
    </div>
  </div>
</template>

<script>
import { path, live } from '@live-change/vue3-ssr'

export default {
  inject: ['workingZone'],
  async setup() {
    const [ sessionName, firstMessages ] = await Promise.all([
        live(
            path().sessionName.sessionName()
        ),
        live(
            path().shoutBox.messagesByTimestamp({ lt: "\xFF\xFF\xFF\xFF", limit: 20, reverse: true })
                .with(msg => path().sessionName.publicSessionName({
                  session: msg.session.$nonEmpty()
                }).bind('sessionName'))
        )
    ])
    return { sessionName, firstMessages }
  },
  methods: {
    resetName() {
      this.workingZone.addPromise('delete name', this.$actions.sessionName.resetSessionName())
    }
  }
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
