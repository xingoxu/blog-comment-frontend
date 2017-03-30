<template>
  <div class="emoji">
    <div class="button-slot" @click.stop="disabled ? false : toggleEmoji()">
      <slot></slot>
    </div>
    <transition name="transup-fade">
      <div class="emoji-panel" @click.stop="(false)" v-if="emojiShowing">
        <div class="tab clrfix">
          <a href="javascript:;" 
            v-for="(emojiTab,index) in emojiList"          
            class="pull-left" :class="{'active': currentEmoji == index}"
            @click="currentEmoji=index">{{ emojiTab.name }}</a>
        </div>
        <transition-group name="fade" tag="div" class="fade-wrapper">
          <div class="emojis" v-for="(emojiTab,index) in emojiList " v-show="index == currentEmoji" :key="index">
            <a href="javascript:;"
              v-for="emoji in emojiTab.emojis"
              @click="$emit('input',emoji.value)">
              <span v-if="emoji.text">{{ emoji.text }}</span>
              <img v-if="emoji.url" :src="emoji.url">
            </a>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: ['disabled'],
    methods: {
      toggleEmoji() {
        this.emojiShowing = !this.emojiShowing;
      },
      hideEmoji() {
        this.emojiShowing = false;
      }
    },
    mounted() {
      document.addEventListener('click', this.hideEmoji, false);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.hideEmoji);
    },
    data() {
      return {
        emojiShowing: false,
        emojiList: emojiList,
        currentEmoji: 0,
      }
    }
  }
  import emojiList from '../emoji-list.js';
</script>

<style lang="less" scoped>
  .emoji {
    position: relative;
  }
  
  .emoji-panel {
    position: absolute;
    top: 100%;
    margin-top: 10px;
    left: 0;
    width: 500px;
    background: #f1f1f1;
    line-height: normal;
    padding: 10px 20px 20px 20px;
    border-radius: 2px;
    filter: drop-shadow(0px 1px 4px rgba(0,0,0,0.14));
    z-index: 1;
    &:before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 10px;
      width: 0;
      height: 0;
      border-left: 13px solid transparent;
      border-right: 13px solid transparent;
      border-bottom: 10px solid #f1f1f1;
    }
  }
  a {
    text-decoration: none;    
  }
  .tab>a {
    margin-right: 10px;
    color: #404040;
    padding: 10px;
    position: relative;
    transition: .3s color ease;
    &:last-child {
      margin-right: 0;
    }
    &:hover,&.active {
      color: #4184f3;
      &:after{
        width: 100%;
        left: 0%;
      }
    }
    &:after{
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 0;
      height: 4px;
      transition: .3s all ease;
      transition-property: left,width;
      background: #4184f3;
    }
  }
  .emojis {
    margin-top: 10px;
    margin-bottom: -10px;
    margin-left: -5px;
    margin-right: -5px;
  }
  .emojis>a {
    display: inline-block;
    padding: 5px 10px;
    color: #404040;
    transition: .3s all ease;
    font-size: 16px;
    &:hover {
      color: #4184f3;
      transform: scale(1.3);
    }
  }


  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter,.fade-leave-to {
    opacity: 0;
  }
  .fade-leave,.fade-leave-to {
    position: absolute;
    top: 0;
  }
  .fade-wrapper {
    position: relative;
  }
  .transup-fade-enter-active, .transup-fade-leave-active {
    transition: .3s all;
    transition-property: transform,opacity;
  }
  .transup-fade-enter,.transup-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
  }
</style>