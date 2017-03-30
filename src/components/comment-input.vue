<template>
  <div class="comment-input">
    <div class="avatar pull-left">
      <a :href="validateURL(author_url)=='' ? false : author_url" target="_blank">
        <img :src="imgsrc" width="50" height="50">
      </a>
    </div>
    <div class="input-wrapper">
      <div class="edit">
        <div class="pull-right">
          <input type="text" :disabled="submitting" v-model="author_name" placeholder="昵称（必填）">
          <input type="text" :disabled="submitting" v-model="author_email" placeholder="邮箱（必填，不会公开）">
          <input type="text" :disabled="submitting" v-model="author_url" placeholder="你的网站（带上协议）">
        </div>
        <div class="textarea" :class="{'disabled': submitting}">
          <textarea class="autoresize" 
            v-model="text" 
            @input="resizeTextArea" 
            :style="{
              height: init_height+'px'
            }"
            placeholder="说点什么吧..." title="Ctrl + Enter 快捷提交"
            :disabled="submitting" 
            @keyup.ctrl.enter="(valid ? submit() : false)"
            ref="textarea"></textarea>
        </div>
      </div>
      <div class="func-wrapper clrfix">
        <div class="pull-right">
          <button type="submit" :disabled="submitting || !valid" @click="submit">发布</button>
        </div>
        <div class="left clrfix">
          <div class="pull-right tip">
            新版评论支持Markdown <a href="https://github.com/xingoxu/blog-comment-frontend/blob/dev/help/index.md" target="_blank">如何设置头像？</a>
          </div>
          <div class="left operation">
            <emoji class="add-emoji" :disabled="submitting" @input="addEmoji">
              <button>表情</button>
            </emoji>
            <button class="add-pic" :disabled="submitting" title="插入图片" @click="insertPic">图片</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['parent_comment_id'],    
    methods: {
      resizeTextArea() {
        var textarea = this.$refs.textarea;
        setTimeout(() => {
          if(!textarea)
            return;
          textarea.style.height = this.init_height + 'px';
          textarea.style.overflow = 'hidden';
          var height = textarea.scrollHeight;
          if(height > this.max_height){
            height = this.max_height;
            textarea.style.overflow = 'auto';            
          }
          if (this.init_height < height)
            textarea.style.height = height + 'px';
          
        }, 0)
      },
      insertPic(){
        let textarea = this.$refs.textarea;
        let isNothing = (this.text.length == 0);
        if(textarea.selectionStart === undefined){
          return this.text = this.text + (isNothing ? '' : ' ') + '![]()';
        }
        let startPos = textarea.selectionStart;
        this.text = `${this.text.substring(0,startPos)+(isNothing ? '' : ' ')}![]() ${this.text.substr(startPos)}`;
        this.$nextTick(()=>{
          textarea.selectionStart = textarea.selectionEnd = (startPos + (isNothing ? 4 : 5));
          textarea.focus();
        })
      },
      addEmoji(value){
        let textarea = this.$refs.textarea;
        if(textarea.selectionStart == undefined){
          return this.text = this.text + value;
        }
        let startPos = textarea.selectionStart;
        let afterText = this.text.substr(startPos);
        this.text = `${this.text.substring(0,startPos)}${value}${afterText}`;
        this.$nextTick(()=>{
          textarea.selectionStart = textarea.selectionEnd = (this.text.length - afterText.length);
          textarea.focus();
        })
      },
      validateEmail(email){
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
      },
      validateURL(url){
        return /^https?:\/\/[^\s]+$/.test(url);
      },
      submit(){
        let globalData = globalDataFunc.get();
        axios.post('/comments',{
          thread_key: globalData.thread_key,
          thread_url: globalData.thread_url,
          thread_title: globalData.thread_title,
          text: this.text,
          author_name: this.author_name,
          author_email: this.author_email,
          author_url: this.author_url=='' ? undefined : this.author_url,
          parent_comment_id: this.parent_comment_id
        }).then(response => response.data).then( comment => {
          localStorage['author_name'] = this.author_name;
          localStorage['author_email'] = this.author_email;
          localStorage['author_url'] = this.author_url;
          this.$emit('submitted', comment);
          this.text = '';
          this.$nextTick(()=>{
            this.resizeTextArea();
          })
        }).catch( err =>{
          if(err.response){
            return alert(err.response.data.message);
          }
          console.log(err);
        }).then(()=>{ this.submitting = false });;
        this.submitting = true;
      }
    },
    computed: {
      imgsrc(){
        return this.validateEmail(this.author_email) ? `${gravatarHost}/avatar/${md5(this.author_email)}?d=${defaultAvatar}?s=100?r=g`
        : defaultAvatar;
      },
      valid(){
        return this.text.trim().length > 0 &&
        this.author_name.trim().length > 0 &&
        this.validateEmail(this.author_email) &&
        (this.author_url =='' || this.validateURL(this.author_url) )
      }
    },
    created(){
      this.author_name = localStorage['author_name'] || '';
      this.author_email = localStorage['author_email'] || '';
      this.author_url = localStorage['author_url'] || '';
    },
    data() {
      return {
        init_height: 96,
        max_height: 360,
        submitting: false,

        text: '',
        author_name: '',
        author_email: '',
        author_url: '',
      }
    },
    name: 'comment-input',
    components: {
      Emoji
    }
  }
  import md5 from 'md5';
  import { gravatarHost, defaultAvatar } from '@/config.js';
  import globalDataFunc from './globalData.js';
  import axios from './axiosInstance.js';
  import Emoji from './emoji.vue';
</script>

<style lang="less" scoped>
  textarea.autoresize {
    overflow: hidden;
    resize: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: #999;
    word-wrap: break-word;
    word-break: break-all;
    display: block;
    width: 100%;
    font: inherit;
    &:focus {
      color: #333;
    }
  }
  div.textarea {
    border-radius: 2px;
    padding: 10px;
    background: rgba(216, 216, 216, .5);
    margin-right: 230px;
  }
  button[type=submit] {
    width: 80px;
    background: rgb(65, 132, 243);
    color: #FFF;
    border: 0;
    padding: 0 16px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
    transition: .3s all ease;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2);
    &:hover {
      background: rgba(65, 132, 243,.8);
    }
    &:focus {
      background: rgba(65, 132, 243,.8);
    }
    &:active {
      background: #3264b7;
      box-shadow: 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12), 0 5px 5px -3px rgba(0,0,0,.4);
    }
    [disabled],&:disabled {
      opacity: 0.5;
      &:hover {
        background: rgb(65, 132, 243);        
      }
    }
  }
  .left {
    margin-right: 80px;
    >* {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      vertical-align: top;
    }
    button {
      cursor: pointer;
      padding: 0 10px;
      background: transparent;
      border: 0;
      margin: 0;
    }
  }
  .func-wrapper {
    margin-top: 10px;
  }
  .tip {
    margin-right: 10px;
  }
  input,button,textarea {
    font: inherit;
    outline: 0;        
    [disabled],&:disabled {
      cursor: not-allowed;      
    }
  }
  input,textarea {
    display: block;
    transition: .3s all;
    transition-property: color,background;
    [disabled],&:disabled {
      background: #d2d2d2;
    }
  }
  input {
    box-sizing: border-box;
    padding: 5px 10px;
    background: rgba(216, 216, 216, 0.5);
    margin-right: 6px;
    width: 220px;
    border-radius: 2px;
    border: 0;
    margin: 0;
    height: 32px;
    line-height: 32px;
  }
  div.edit {
    input {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  div.textarea {
    transition: .3s all;
    transition-property: color,background;
    outline: 0;  
    &.disabled{
      background: #d2d2d2;      
    }
  }
  a {
    text-decoration: none;
    outline: 0;
    color: #4184f3;
  }
  .input-wrapper {
    padding-left: 70px;
  }
  .comment-input {
    margin: 10px 0;
  }
  .avatar {
    img {
      border-radius: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.22);
    }
  }

  @media screen and (max-width: 510px) {
    .tip {
      float: none;
    }
    .operation {
      display: block;
    }
    .left > * {
      height: auto;
    }
    .edit {
      input {
        width: 100%;
      }
      .pull-right {
        float: none;
      }
      .textarea {
        margin-top: 10px;
        margin-right: 0;
      }
    }
  }

  .a-unique-prefix.comments-wrapper.mobile {
    .add-emoji {
      display: none;
    }
  }
</style>