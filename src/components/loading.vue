<template>
  <div class="loading">
    <svg viewBox="25 25 50 50" class="circle">
      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
    </svg>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="less" scoped>

  .circle {
    width: 42px;
    height: 42px;
    animation: loading-rotate 2s linear infinite
  }

  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90,150;
    stroke-dashoffset: 0;
    stroke-width: 4;
    transition: stroke .3s;
    stroke: #4184f3;    
  }
  @keyframes loading-rotate {
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1,200;
      stroke-dashoffset: 0;
    }
    25% {
      stroke: rgb(255, 152, 0);
    }
    50% {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -40px;
      stroke: #4184f3;
    }
    75% {
      stroke: #00a67c;
    }
    to {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -120px;
    }
  }
</style>