<template>
  <div class="comment-wrapper">
    <div class="comment-self clrfix">
      <div class="avatar pull-left">
        <a :href="comment.author_url" target="_blank">
          <img :src="imgsrc" :alt="comment.author_name" width="50" height="50">
        </a>
      </div>
      <div class="right">
        <div class="author">
          <a :href="comment.author_url" target="_blank">{{ comment.author_name }}</a>
          <span v-if="admin == comment.uid" class="ua ua_admin"><i class="fa fa-user"></i> admin</span>
          <span v-if="uaResult && uaResult.osText" :class="'ua os_' + uaResult.osResult.os">
            <i :class="'fa fa-' + uaResult.osResult.icon"></i>{{ uaResult.osText }}
          </span>
          <span v-if="uaResult && uaResult.deviceResult" class="ua device">
            <i class="fa fa-mobile"></i>{{ uaResult.deviceResult }}
          </span>
          <span v-if="uaResult && uaResult.browserText" :class="'ua ua_' + uaResult.browserResult.browser">
            <i :class="'fa fa-'+ uaResult.browserResult.icon"></i>{{ uaResult.browserText }}
          </span>
          <span class="ua_other" v-if="uaResult && !uaResult.browserText">
            <i class="fa fa-globe"></i>{{ comment.author_ua }}
          </span>
        </div>
        <div class="comment-text" v-html="compiledMarkdown" @click="imgNewWindow" ref="comment_text_dom"></div>
        <div class="operation">
          <span class="time" :title="time.format('YYYY-MM-DD HH:mm')">{{ time.format('YYYY年MM月DD日') }}</span>
          <a href="javascript:;" class="reply" @click="showReplyInput=!showReplyInput"><i class="fa fa-reply" aria-hidden="true"></i>回复</a>
        </div>
        <transition name="height">
          <comment-input v-if="showReplyInput" :parent_comment_id="this.comment.comment_id"
          @submitted="pushComment" ></comment-input>
        </transition>
      </div>
    </div>
    <div class="children-comments" 
      :class="{'no-margin': isMaxChildrenLevel , 'odd': level%2 == 1 }" v-if="comment.children_comments && comment.children_comments.length>0">
      <comment v-for="child_comment in comment.children_comments" :comment="child_comment" :admin="admin" :key="child_comment.comment_id" :level="level+1"></comment>
    </div>
  </div>
</template>

<script>
  var markdownRender = markdownIt({
    typographer: false,
    linkify: true,
    highlight: function (str, lang) {
      if (lang && highlightJs.getLanguage(lang)) {
        try {
          return `<pre class="hljs highlight ${lang}"><code>${highlightJs.highlight(lang, str, true).value}</code></pre>`;
        } catch (__) {}
      }

      return '<pre class="highlight"><code>' + markdownRender.utils.escapeHtml(str) + '</code></pre>';
    }
  });
  export default {
    props: ['comment', 'admin','level'],
    name: 'comment',
    methods: {
      pushComment(comment){
        if(!this.comment.children_comments)
          this.comment.children_comments = [];
        this.comment.children_comments.push(comment);
        this.showReplyInput = false;
      },
      imgNewWindow(event){
        let el = event.target;
        if(el.tagName.toLowerCase()!='img')
          return;
        event.preventDefault();
        let comment_text_dom = this.$refs.comment_text_dom;
        let linkImgArray = [].slice.call(comment_text_dom.querySelectorAll('a>img'));
        for(let i = 0 ; i < linkImgArray.length ; i++){
          if(el==linkImgArray[i])
            return window.open(el.parentElement.href , '_blank');
        }

        window.open(el.src , '_blank');
      }
    },
    computed: {
      imgsrc() {
        return this.comment.uid ? `${gravatarHost}/avatar/${this.comment.uid}?d=${defaultAvatar}?s=100?r=g` :
          defaultAvatar;
      },
      uaResult(){
        return this.comment.author_ua && ua.getResult(this.comment.author_ua);
      },
      time(){
        return moment(parseInt(this.comment.create_time));
      },
      isMaxChildrenLevel(){
        return this.level >= maxChildrenLevel;
      },
      compiledMarkdown(){
        return markdownRender.render(this.comment.text);
      },
    },
    data(){
      return {
        showReplyInput: false,
      }
    },
    components: {
      commentInput
    }
  }

  import {
    gravatarHost,
    defaultAvatar
  } from '@/config.js';
  import ua from './ua.js';
  import moment from 'moment/src/moment.js';
  import commentInput from './comment-input.vue';
  import {maxChildrenLevel} from '../config.js';
  import markdownIt from 'markdown-it';
  import highlightJs from 'highlight.js';
</script>

<style lang="less" scoped>
  .avatar {
    img {
      border-radius: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.22);
    }
  }
  .right {
    margin-left: 70px;
  }
  .author {
    line-height: 50px;
    > * {
      line-height: normal;
    }
  }
  a {
    text-decoration: none;
    color: #404040;
    &[href]{
      transition: .3s all;
      color: #4184f3;
      &:hover {
        opacity: .8;
      }
    }
  }
  .comment-text {
    margin: 10px 0 20px 0;
    word-break: break-all;
  }

  .operation {
    font-size: 12px;
    color: #999;
    .fa {
      margin-right: 2px;
    }
    .reply {
      opacity: 0;
      color: #999;
    }
  }
  .comment-self {
    margin: 20px 0;
  }
  .comment-self:hover {
    .operation {
      .reply {
        opacity: 1;
        color: #999;
        &:hover {
          color: #555;          
        }
      }
    }
  }
  .children-comments {
    margin-left: 60px;
    &.no-margin {
      margin-left: 0;
    }
  }
  .comments-wrapper.mobile {
    .comment-self {
      margin: 10px 0;
    }
    .children-comments {
      margin-left: 0;
      padding: 1px 10px 10px 10px;
      background: #FFF;
      &.odd {
        background: rgba(216, 216, 216, 0.5);
      }
      &.no-margin {
        margin-left: 0;
        background: #FFF;
        padding: 0;
      }
    }
  }

  .height-enter-active, .height-leave-active {
    transition: all .5s ease-in;
    overflow: hidden;
  }
  .height-leave-active {
    transition: all .5s ease;    
  }
  .height-enter, .height-leave-to {
    max-height: 0;
  }
  .height-enter-to, .height-leave {
    max-height: 100vh;
  }

  @media screen and (max-width: 500px){
    .author {
      line-height: 1.6;
      min-height: 50px;
      white-space: pre-line;
    }
  }





  //ua start
  span.ua {
    color: #fff;
    font-size: 75%;
    display: inline-block;
    padding: .2em .6em;
    border-radius: 2px;
  }

  span.ua .fa {
    margin: 0 2px 0 0;
  }

  .ua_other,.os_other {
    background-color: #ccc;
    color: #fff;
    border: 1px solid #bbb;
  }

  .ua_firefox {
    background-color: #f0ad4e;
    border-color: #eea236;
  }

  .ua_maxthon {
    background-color: #7373b9;
    border-color: #7373b9;
  }

  .ua_baidu {
    background-color: #428bca;
    border-color: #357ebd;
  }

  .ua_ucweb {
    background-color: #ff740f;
    border-color: #d43f3a;
  }

  .ua_sogou {
    background-color: #78ace9;
    border-color: #4cae4c;
  }

  .ua_2345explorer {
    background-color: #2478b8;
    border-color: #4cae4c;
  }

  .ua_2345chrome {
    background-color: #f9d024;
    border-color: #4cae4c;
  }

  .ua_lbbrowser {
    background-color: #fc9d2e;
    border-color: #4cae4c;
  }

  .ua_wechat {
    background-color: #4cae4c;
    border-color: #3d88a8;
  }

  .ua_qq {
    background-color: #3d88a8;
    border-color: #4cae4c;
  }

  .ua_mi {
    background-color: #ff4a00;
    border-color: #4cae4c;
  }

  .ua_chrome {
    background-color: #ee6252;
    border-color: #4cae4c;
  }

  .ua_apple {
    background-color: #e95620;
    border-color: #4cae4c;
  }

  .ua_opera {
    background-color: #d9534f;
    border-color: #d43f3a;
  }

  .ua_ie {
    background-color: #428bca;
    border-color: #357ebd;
  }

  .ua_360 {
    background-color: #44d894;
    border-color: #36cee1;
  }

  .os_windows {
    background-color: #39b3d7;
    border-color: #46b8da;
  }

  .os_android {
    background-color: #98c13d;
    border-color: #01b171;
  }

  .os_ubuntu {
    background-color: #dd4814;
    border-color: #01b171;
  }

  .os_linux {
    background-color: #3a3a3a;
    border-color: #1f1f1f;
  }

  .os_apple {
    background-color: #666;
    border-color: #1f1f1f;
  }

  .os_unix {
    background-color: #060;
    border-color: #1f1f1f;
  }

  .os_symbian {
    background-color: #014485;
    border-color: #1f1f1f;
  }

  .ua_admin {
    background-color: #00a67c;
    border-color: #01b171;
  }

  .device {
    background-color: #797979;
    border-color: #1f1f1f;
  }
</style>

<style lang="less">
  .a-unique-prefix.comments-wrapper {
    .comment-text {
      p > code {
        padding: 1px 3px;
        margin: 0 3px;
        background: #ddd;
        border: 1px solid #ccc;
        word-wrap: break-word;
      }
      
      a {
        color: #4184f3;
        text-decoration: none;
      }
      img {
        max-width: 64px;
        border-radius: 4px;
        cursor: pointer;
      }
      table * {
        box-sizing: border-box;
      }
      table {
        border-collapse: collapse;
      }
      table > tbody > tr:nth-child(odd) > td, table > tbody > tr:nth-child(odd) > th {
        background-color: #f9f9f9;
      }
      table > thead > tr > th, table > tbody > tr > th, table > tfoot > tr > th, table > thead > tr > td, table > tbody > tr > td, table > tfoot > tr > td {
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
        border-top: 1px solid #ddd;
      }
      table > caption + thead > tr:first-child > th, table > colgroup + thead > tr:first-child > th, table > thead:first-child > tr:first-child > th, table > caption + thead > tr:first-child > td, table > colgroup + thead > tr:first-child > td, table > thead:first-child > tr:first-child > td {
          border-top: 0;
      }
    }
  }

</style>