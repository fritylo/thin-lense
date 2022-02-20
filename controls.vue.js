const vm = new Vue({
   el: '#controls',
   data: {
      STRING_LENS_FOCUS: 100,
      OBJECT_SIZE: 40,
   },
   watch: {
      OBJECT_SIZE(val, oldVal) {
         redrawObject();
      },
      STRING_LENS_FOCUS(val, oldVal) {
         redrawFocus();
      }
   },
   computed: {
      OBJECT_BEGIN() {
         return [100, window.mainPaper.view.center.y + 0];
      },
      OBJECT_TARGET() {
         return [100, window.mainPaper.view.center.y - this.OBJECT_SIZE];
      },
      LENS_FOCUS: {
         get() {
            return +this.STRING_LENS_FOCUS;
         },
         set(value) {
            return this.STRING_LENS_FOCUS = value + '';
         }
      },
   }
});

window.vm = vm;