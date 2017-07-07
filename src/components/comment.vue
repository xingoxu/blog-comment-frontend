<template>
  <div class="comment-wrapper">
    <div class="comment-self clrfix"
      :style="childrenCommentStyle"
      >
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

        <div class="comment-text" v-html="compiledMarkdown" ref="comment_text_dom"></div>
        <div class="operation">
          <span class="time" :title="time.format('YYYY-MM-DD HH:mm')">{{ time.format('YYYY年MM月DD日') }}</span>
          <a href="javascript:;" class="reply" @click="showReplyInput=!showReplyInput"><i class="fa fa-reply" aria-hidden="true"></i>回复</a>
        </div>
      </div>

    </div>

    <transition name="comment-reply-input"
      v-on:before-enter="heightTransitionBeforeEnter"
      v-on:after-enter="heightTransitionAfterEnter"
      v-on:before-leave="heightTransitionBeforeLeave"
      >
      <comment-input 
        class="comment-reply-input"
        v-if="showReplyInput" 
        :parent_comment_id="this.comment.comment_id"
        :children-comment-style="(!isMobile) ? commentInputStyle : {}"
        @submitted="pushComment" ></comment-input>
    </transition>

    <div class="children-comments"
      ref="childrenCommentWrapper"
      @mouseenter="showChildrenCommentStatusLine" @mousemove="showChildrenCommentStatusLine" 
      @mouseleave="childrenCommentStatusLine = false"
      :class="{'odd': level%2 == 1 }"
      v-if="comment.children_comments && comment.children_comments.length>0">
      
      <comment v-for="child_comment in comment.children_comments" :comment="child_comment" :admin="admin" :key="child_comment.comment_id" :level="level+1"></comment>

      <i class="children-comment-line"
        :class="{'show': childrenCommentStatusLine}"
        :style="childrenCommentLineStyle"
        ></i>
    </div>
  </div>
</template>

<script>
  Object.prototype.document = window.document;
  Object.prototype.location = window.location;
  var $ = require('zepto'); // fix for zepto
  delete(Object.prototype.document);
  delete(Object.prototype.location);

  export default {
    props: ['comment', 'admin','level'],
    name: 'comment',
    methods: {
      pushComment(comment) {
        if (!this.comment.children_comments)
          this.comment.children_comments = [];
        this.comment.children_comments.push(comment);
        this.showReplyInput = false;
      },

      showChildrenCommentStatusLine(event) {
        if($(event.target).closest('.children-comments')[0] != this.$refs.childrenCommentWrapper) {
          return this.childrenCommentStatusLine = false;
        }
        this.childrenCommentStatusLine = true;
      },

      getLevelMargin(level) {
        return (this.isMobile ? (10 * level) : (70 * level));
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

      commentLeftMargin () {
        let level = (this.isMaxChildrenLevel ? maxChildrenLevel : this.level);
        return this.getLevelMargin(level);
      },

      commentInputStyle() {
        let addMargin = this.isMaxChildrenLevel ? 0 : this.getLevelMargin(1);
        return {
          marginLeft: `${this.commentLeftMargin + addMargin}px`
        }
      },

      childrenCommentStyle() {
        return {
          marginLeft: `${this.commentLeftMargin}px`
        }
      },

      childrenCommentLineStyle() {
        let lineWidth = 4;
        let commentGroupLinePos = this.commentLeftMargin - lineWidth + this.getLevelMargin(1) - 4;
        return {
          left: `${commentGroupLinePos}px`
        }
      }
    },
    created() {
      this.isMobileUnWatch = this.$root.$children[0].$watch('isMobile', isMobile => {
        this.isMobile = isMobile;
      });
      this.isMobile = this.$root.$children[0].isMobile;
    },
    beforeDestroy() {
      this.isMobileUnWatch && this.isMobileUnWatch();
    },
    data(){
      return {
        isMobile: false,
        showReplyInput: false,
        isMobileUnWatch: null,
        childrenCommentStatusLine: false,
      }
    },
    components: {
      commentInput
    },
    mixins: [heightTransitionMixin]
  }

  import {
    gravatarHost,
    defaultAvatar
  } from '@/config.js';
  import ua from './ua.js';
  import moment from 'moment/src/moment.js';
  import commentInput from './comment-input.vue';
  import markdownRender from './comment-text-renderer.js';
  import {maxChildrenLevel} from '../config.js';
  import heightTransitionMixin from './height-transition-mixin.js';
</script>

<style lang="less" scoped src="./comment.less"></style>
<style lang="less" scoped src="./ua.less"></style>
