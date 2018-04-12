<template>
  <transition name="slide-fade">
    <div class="vue-message" v-show="visible">
      <div class="message-icon" :class="`message-${type}`">
        <svg><use :xlink:href="`#icon-${iconType}`"></use></svg>
      </div>
      <p>{{message}}</p>
      <svg class="icon-close" v-if="showClose" @click="close"><use xlink:href="#icon-close"></use></svg>
    </div>
  </transition>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        message: '',
        showClose: document.visibilityState === 'hidden',
        type: 'success',
        duration: 2000,
        callback: null
      }
    },
    computed: {
      iconType() {
        const all = {
          info: 'tip',
          success: 'check',
          error: 'close',
          warn: 'warn'
        }
        return all[this.type]
      }
    },
    methods: {
      destroy() {
        this.$el.removeEventListener('transitionend', this.destroy)
        this.$destroy()
        document.body.removeChild(this.$el)
      },
      close() {
        this.visible = false
        this.$el.addEventListener('transitionend', () => {
          this.$destroy()
          document.body.removeChild(this.$el)
        })
      }
    },
    mounted() {
      if (!this.showClose) {
        setTimeout(() => {
          this.visible = false
          this.$el.addEventListener('transitionend', this.destroy)
          this.callback && this.callback()
        }, this.duration)
      }
    }
  }
</script>
