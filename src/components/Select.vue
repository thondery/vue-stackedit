<template>
  <div class="vue-select" @click="handleClick">
    <div class="selected left-right">
      <div class="layer-disabled" v-if="disabled" @click.stop></div>
      <div class="left">
        <span class="s-tag" :class="{'s-tag-custom': customizable && s.custom}" v-if="multiple" v-for="(s,i) of selected"><span class="tag-name">{{s.name}}</span><svg
          class="icon-close" @click="remove(s,i)"><use xlink:href="#svg-close"></use></svg></span>
        <input ref="input" class="input" :size="customText.length*2 || 1" v-if="multiple && customizable" v-model="customText" @keypress.enter.prevent="custom">
        <input class="input" v-if="!multiple" :value="selected.name" :title="selected.name" :size="selected.name ? selected.name.length*2 : 0"
               :placeholder="placeholder" readonly>
        <span class="s-placeholder" v-if="multiple && !customizable && !selected.length">{{placeholder}}</span>
      </div>
      <div class="right">
        <svg class="icon-arrow-down" :class="{reverse: !bShowCandidates}">
          <use xlink:href="#svg-arrow-down"></use>
        </svg>
      </div>
    </div>
    <div class="candidates" v-show="bShowCandidates">
      <div class="item-search" v-if="searchable"><input class="input" placeholder="搜索" v-model="filterText"></div>
      <ul class="list">
        <li :class="{focus: i.selected}" v-for="i of filteredItems" :title="i.name" @click.stop="toggle(i)"><span class="item-name">{{i.name}}</span><svg
          class="icon-check" v-show="i.selected"><use xlink:href="#svg-check"></use></svg></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selected: this.multiple ? [] : {},
        items: [],
        customText: '',
        filterText: '',
        bShowCandidates: false,
        clicked: false
      }
    },
    computed: {
      filteredItems() {
        if (this.filterText === '') return this.items
        return this.items.filter(item => item.name.toLowerCase().includes(this.filterText.toLowerCase()))
      }
    },
    props: {
      source: Array,
      current: {
        validator(val) {
          return val
        }
      },
      disabled: Boolean,
      multiple: Boolean,
      customizable: Boolean,
      searchable: Boolean,
      placeholder: {
        type: String,
        'default': '请选择'
      },
      max: Number
    },
    watch: {
      source(val) {
        //Watch source for requesting data from server asynchronously
        this.items = JSON.parse(JSON.stringify(val))
        this.setSelected()
      },
      current(val) {
        this.selected = val ? JSON.parse(JSON.stringify(val)) : this.selected
        this.setSelected()
      }
    },
    methods: {
      setSelected() {
        if (Array.isArray(this.selected)) {
          let tmp = {}
          this.selected.forEach(s => {
            tmp[s.value] = 1
          })
          this.items.forEach(i => {
            i.selected = !!tmp[i.value]
          })
        } else {
          this.items.forEach(i => {
            i.selected = i.value === this.selected.value
          })
        }
      },
      handleClick() {
        this.clicked = true
        this.bShowCandidates = true
      },
      focusInput() {
        this.$refs.input.focus()
      },
      toggle(item) {
        if (this.multiple) {
          item.selected = !item.selected

          if (item.selected) {
            if (this.max && this.selected.length >= this.max) {
              this.warn(`最多只能选择${this.max}个`)
              item.selected = false
            } else {
              this.selected.push(item)
            }
          } else {
            this.selected = this.selected.filter(val => {
              return val.value !== item.value
            })
          }
          this.customizable && this.focusInput()
          this.$emit('update', this.selected)
        } else {
          this.items.forEach(current => {
            current.selected = false
          })
          item.selected = true
          this.selected = item
          this.bShowCandidates = false
          this.$emit('update', this.selected)
        }
      },
      custom() {
        let { customText } = this
        if (customText === '') return

        if (this.max && this.selected.length >= this.max) {
          this.warn(`最多只能选择${this.max}个`)
          return
        }

        let existed = this.selected.some(val => {
          return val.name === customText || val.value === customText
        })

        if (!existed) {
          this.selected.push({
            name: customText,
            value: customText,
            custom: true
          })

          this.customText = ''
          this.$emit('update', this.selected)
        }
      },
      remove(select, index) {
        this.selected.splice(index, 1)

        if (!this.customizable || !select.custom) {
          this.items.forEach(val => {
            if (val.value === select.value) {
              val.selected = false
            }
          })
        }

        this.customizable && this.focusInput()
        this.$emit('update', this.selected)
      }
    },
    created() {
      //Must deep clone
      this.items = JSON.parse(JSON.stringify(this.source))
      this.selected = this.current ? JSON.parse(JSON.stringify(this.current)) : this.selected
      this.setSelected()
    },
    mounted() {
      window.addEventListener('click', () => {
        if (!this.clicked) {
          this.bShowCandidates = false
        }
        this.clicked = false
      })
    }
  }
</script>
