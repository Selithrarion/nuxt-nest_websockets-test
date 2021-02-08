<template>
	<div>websockets</div>
</template>

<script>
export default {
	data() {
		return {};
	},
  mounted() {
	  this.socket = this.$nuxtSocket({
      channel: '/index'
    })
    this.socket.on('receive_message', (msg, cb) => {
      console.log('receive', msg, cb)
    })
    this.socket.emit('send_message', (msg, cb) => {
      console.log('send', msg, cb)
    })
  }
};
</script>

<style scoped></style>
