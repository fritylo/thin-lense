<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Thin Lense</title>
   <link rel="stylesheet" href="index.css">
</head>

<body>
   <canvas id="myCanvas" resize></canvas>
   <div class="controls" id="controls">
      <div class="range-set">
        <span>{{STRING_LENS_FOCUS}}</span>
        <input type="range" id="rangeFocus" min="50" max="200" v-model="STRING_LENS_FOCUS">
        <label for="volume">Focus</label>
      </div>
      <button id="buttonToggleLens">Toggle Lens</button>
      <div class="range-set">
        <span>{{OBJECT_SIZE}}</span>
        <input type="range" id="rangeObjectSize" min="20" max="70" v-model="OBJECT_SIZE">
        <label for="volume">Object Size</label>
      </div>
   </div>

   <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
   <script src="controls.vue.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js" integrity="sha512-ovjLI1ZcZe6bw+ImQ21r+sv8q/Vwob2kq7tFidK6E1LWfi0T4uobbmpfEU1//a9h9o5Kkt+MnMWf6rWlg0EiMw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
   <script src="index.js" type="text/paperscript" canvas="myCanvas"></script>
</body>

</html>