<template>
  <div class="comments-wrapper a-unique-prefix" :class="{'mobile': isMobile}">
    <comment-input @submitted="shiftComment" class="top-input"></comment-input>
    <div class="comments-list-wrapper" ref="comments_list_dom">
      <comment v-for="comment in comments" :comment="comment" :admin="admin" :key="comment.comment_id" :level="0"></comment>
      <transition name="fade">
        <div class="loading-mask" v-show="commentLoading">
          <loading class="loading-icon"></loading>        
        </div>
      </transition>
      <transition name="fade">
        <div class="message-tip no-comment" v-if="comments && comments.length == 0">
          还没有评论，赶快抢个沙发吧！
        </div>
      </transition>
      <transition name="fade">        
        <div class="message-tip error-message" v-if="errorMessage">
           {{ errorMessage }} <a href="javascript:;" @click="getComments">点击重试</a> 
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      this.getComments();
    },
    mounted(){
      this.setMobile();
      window.addEventListener('resize',this.setMobile);
    },
    beforeDestroy(){
      window.addEventListener('resize',this.setMobile);
    },
    methods: {
      getComments() {
        axios.get('/comments', {
          params: {
            thread_key: globalData.get().thread_key
          }
        }).then(response => response.data).then(data => {
          this.comments = data.comments;
          this.admin = data.admin;
        }).catch( err => {
          if(err.response){
            return this.errorMessage = err.response.data.message;
          }
          this.errorMessage = err.message;
          console.log(err);
        }).then(() => {
          this.commentLoading = false;          
        })
        this.errorMessage = null;
        this.commentLoading = true;
      },
      shiftComment(comment){
        if(!this.comments)
          this.comments = []
        this.comments.unshift(comment);
      },
      setMobile(){
        this.isMobile = (this.$refs.comments_list_dom.getBoundingClientRect().width <= 800);
      }
    },
    data() {
      return {
        admin: null,
        comments: null,
        commentLoading: true,
        isMobile: false,
        errorMessage: null,
      }
    },
    components: {
      commentInput,
      comment,
      loading
    }
  }
  import axios from './components/axiosInstance.js';
  import globalData from './components/globalData.js';
  import commentInput from './components/comment-input.vue';
  import comment from './components/comment.vue';
  import loading from './components/loading.vue';
</script>

<style lang="less" scoped>
  .comments-wrapper {
    font: 13px -apple-system,BlinkMacSystemFont,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
    border-top: 1px solid rgba(0,0,0,0.13);
    .top-input {
      margin: 20px 0;
    }
  }
  .comments-list-wrapper {
    position: relative;
    min-height: 150px;
  }
  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,.5);
  }
  .loading-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -21px;
    margin-top: -21px;
  }
  .message-tip {
    line-height: 150px;
    text-align: center;
    color: #999;
    a {
      text-decoration: none;
      color: #4184f3;
    }
  }
  .fade-enter-active,.fade-leave-active{
    transition: .3s opacity ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
<style lang="less">
  .pull-right {
    float: right;
  }
  .pull-left {
    float: left;
  }
  .clrfix {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

</style>

<style lang="less">
  //highlight
  /*
  Atom One Dark by Daniel Gamage
  Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax
  base:    #282c34
  mono-1:  #abb2bf
  mono-2:  #818896
  mono-3:  #5c6370
  hue-1:   #56b6c2
  hue-2:   #61aeee
  hue-3:   #c678dd
  hue-4:   #98c379
  hue-5:   #e06c75
  hue-5-2: #be5046
  hue-6:   #d19a66
  hue-6-2: #e6c07b
  */
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #abb2bf;
    background: #282c34;
    border-radius: 2px;
  }

  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }

  .hljs-literal {
    color: #56b6c2;
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta-string {
    color: #98c379;
  }

  .hljs-built_in,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: #d19a66;
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: #61aeee;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-link {
    text-decoration: underline;
  }
</style>