<template>
  <div class="vue-editor" :class="{fullscreen: fullscreen}">
    <custom-svg/>
    <vue-popup-window title="上传图片" :show="showUpload" @close="showUpload = false">
      <template slot="content">
        <form @submit.prevent="uploadImage">
          <div class="vue-tab-wrap">
            <vue-tab :titles="['上传网络图片', '上传本地图片']" @select="selectTab"></vue-tab>
          </div>
          <div class="up-panel upload-url" v-if="uploadUrl">
            <div class="input-url">
              <label class="label">图片地址：</label>
              <input class="input" name="url">
            </div>
          </div>

          <div class="up-panel upload-file" v-else>
            <div class="input-file">
              <vue-upload-button name="attachment" show-thumb></vue-upload-button>
            </div>
          </div>

          <div class="upload-submit">
            <vue-submit-button text="确定" :loading="uploadLoading"></vue-submit-button>
          </div>
        </form>
      </template>
    </vue-popup-window>

    <div class="ve-head" v-show="showNavigationBar">
      <navigation-bar @do-click="clickNavbar"></navigation-bar>
    </div>
    <div class="ve-body">
      <div class="ve-editor" :class="{expand: !showPreview}" v-show="showEditor">
        <pre class="editor-inner markdown-highlighting"></pre>
      </div>
      <div class="ve-button">
        <button-bar></button-bar>
      </div>
      <div class="ve-preview" :class="{expand: !showEditor}" v-show="showPreview">
        <div class="preview-inner blog"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import './extensions'
  import './services/optional'
  import CustomSvg from './components/Svg.vue'
  import NavigationBar from './components/NavigationBar.vue'
  import ButtonBar from './components/ButtonBar.vue'
  import editorSvc from './services/editorSvc'
  import store from './store'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {asyncFetch} from './utils/tools'

  export default {
    data() {
      return {
        showUpload: false,
        uploadUrl: true,
        uploadLoading: false
      }
    },
    store,
    components: { CustomSvg, NavigationBar, ButtonBar },
    computed: {
      ...mapState('layout', ['showNavigationBar', 'showPreview', 'showEditor', 'fullscreen'])
    },
    methods: {
      clickNavbar(cmd) {
        if (cmd === 'image') {
          this.uploadUrl = true
          this.showUpload = true
        }
      },
      selectTab(i) {
        this.uploadUrl = i === 0
      },
      uploadImage(ev) {
        const form = ev.target

        if (this.uploadUrl) {
          if (form.url.value === '') {
            this.warn('请填写图片地址')
            return
          }
          this.showUpload = false
          this.insertImage(form.url.value)
          return
        }

        if (this.uploadLoading) return
        this.uploadLoading = true
        asyncFetch({
          type: 'form',
          url: 'community/media',
          data: new FormData(form)
        }).then(body => {
          this.uploadLoading = false
          this.showUpload = false
          this.insertImage(body)
        }).catch(error => {
          this.error(error)
          this.uploadLoading = false
        })
      },
      insertImage(url) {
        store.commit('setUrl', url)
        editorSvc.pagedownEditor.uiManager.doClick('image')
      },
      getContent() {
        return editorSvc.clEditor.getContent()
      },
      setContent(text) {
        editorSvc.clEditor.setContent(text)
      }
    },
    mounted() {
      const editorElt = this.$el.querySelector('.ve-editor .editor-inner')
      const previewElt = this.$el.querySelector('.ve-preview .preview-inner')
      const tocElt = this.$el.querySelector('.ve-head')
      editorSvc.init(editorElt, previewElt, tocElt)
    }
  }
</script>

<style type="text/less" lang="less">
  @import "less/global";
  @import "less/style";
</style>
