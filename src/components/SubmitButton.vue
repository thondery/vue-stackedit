<template>
  <button class="btn vue-submit-button" :type="type" :disabled="disabled">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50" v-if="loading">
      <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
    </svg>
    <span v-else>{{text}}</span>
  </button>
</template>
<script>
  export default {
    props: {
      text: {
        type: String,
        'default': '确定'
      },
      loading: Boolean,
      type: {
        type: String,
        'default': 'submit'
      },
      disabled: Boolean
    }
  }
</script>
