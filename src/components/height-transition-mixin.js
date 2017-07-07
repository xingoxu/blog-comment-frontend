export default {
  methods: {
    heightTransitionBeforeEnter(el) {
      if (el.style.display != 'none') { // v-if el
        let h = el.getBoundingClientRect().height;
        el.style.height = "0px"
        // el.style.padding = "0px 10px";
        // console.log(window.getComputedStyle(el).padding);
        setTimeout(() => {
          el.style.height = h + 'px';
          // el.style.removeProperty('padding');
          // console.log(window.getComputedStyle(el).padding);
        }, 0);
        return;
      }


      // Setup clone
      var clone = el.cloneNode(true), h
      clone.style.width = el.style.width
      clone.style.visibility = 'hidden'
      clone.style.removeProperty('display')

      // get clone height
      el.parentNode.appendChild(clone)
      h = clone.clientHeight
      clone.remove()

      // Force animation instead of simple "setting a height"
      el.style.height = "0px"
      setTimeout(() => el.style.height = h + "px", 1)
    },
    heightTransitionAfterEnter(el) {
      el.style.removeProperty('height');
    },
    heightTransitionBeforeLeave(el) {
      el.style.height = el.clientHeight + "px"
      setTimeout(() => el.style.height = "0px", 1)
    },
    heightTransitionAfterLeave(el) {
      el.style.removeProperty('height')
    }
  }
}