<template>
  <div class="vue-popup-window overlay" v-if="show" @mousemove="dragging" @mouseup="dragEnd">
    <div class="window-lv2" :style="transform">
      <div class="title-bar" @mousedown="dragStart">
        <div class="title-name">{{title}}</div>
        <button class="btn-text btn-close" type="button" @click="close">
          <svg class="icon-close">
            <use xlink:href="#icon-close"></use>
          </svg>
        </button>
      </div>
      <div class="win-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pos: {
          x: 0,
          y: 0
        },
        startX: 0,
        startY: 0,
        flag: false
      }
    },
    props: {
      title: String,
      show: Boolean
    },
    computed: {
      transform() {
        return {
          transform: `translateX(${this.pos.x}px) translateY(${this.pos.y}px)`
        }
      }
    },
    watch: {
      show(val) {
        document.body.classList.toggle('overhidden', val)
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      dragStart(ev) {
        this.startX = ev.pageX - this.pos.x
        this.startY = ev.pageY - this.pos.y
        this.flag = true
      },
      dragging(ev) {
        if (!this.flag) return

        this.pos.x = ev.pageX - this.startX
        this.pos.y = ev.pageY - this.startY
      },
      dragEnd() {
        this.flag = false
      }
    }
  }
</script>
