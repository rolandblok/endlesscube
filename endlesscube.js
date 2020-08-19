function init() {
  squares = new Squares("sqaures");
  squares.animLoop();
}


class Squares {

  constructor(name) {

      this.name = name;
 
      this.canvas = document.getElementById("canvas");
      this.canvas.addEventListener("mousedown", this, false);
      this.canvas.addEventListener("mouseup", this, false);
      this.canvas.addEventListener("mousemove", this, false);
      this.canvas.addEventListener("click", this, false);
      this.canvas.addEventListener("dblclick", this, false);
      //this.canvas.addEventListener("resize", this, false);

      this.canvas.addEventListener('keydown', this, false);
      this.canvas.addEventListener('keyup', this, false);
      this.canvas.addEventListener('wheel', this, false);
      let me = this // this is the-javascript-shiat!  https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
      window.addEventListener( 'resize', function bla(event) {
                console.log("resize " + me.name)
                me.THREEcamera.aspect = window.innerWidth / window.innerHeight;
                me.THREEcamera.updateProjectionMatrix();
                me.renderer.setSize(window.innerWidth, window.innerHeight);
              }, false );

      // STATS
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // GUI
      this.color_1 = "#aaaaaa"
      this.color_2 = "#cccccc"
      this.color_3 = "#eeeeee"
      this.gui = new dat.GUI();
      this.gui_colors = this.gui.addFolder('colors')
      this.gui_colors.addColor(this, "color_1").onChange(function() { me.material_1.color.set(me.color_1) })
      this.gui_colors.addColor(this, "color_2").onChange(function() { me.material_2.color.set(me.color_2) })
      this.gui_colors.addColor(this, "color_3").onChange(function() { me.material_3.color.set(me.color_3) })
      this.gui_colors.open();

     

      // THREE / GL
      this.three_scene = new THREE.Scene();

      // camera

      this.THREEcamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
      this.THREEcamera.up.set(0,1,0);
      this.THREEcamera.position.set(0,0,50)
      this.THREEcamera.lookAt(0,   0,  0)

      /*
      this.fov = 55
      this.THREEcamera = new THREE.PerspectiveCamera( this.fov, 1.33, 0.01, 2000 );
      this.THREEcamera.up = new THREE.Vector3(0,   0,   1)
      this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
      this.THREEcamera.fov = this.fov
      this.THREEcamera.position.set(0, -10, -10)
      this.THREEcamera.lookAt(new THREE.Vector3(0,   0,  0))
      this.THREEcamera.updateProjectionMatrix();
      */
   

      // light
      this.three_light = new THREE.PointLight( 0xFFFFFF, 1, 0 )
      this.three_light.position.set(10, 10, 0)
      this.three_scene.add( this.three_light );

      // raycaster
      this.raycaster = new THREE.Raycaster(); 

      for ( let x = -10; x < 10; x ++ ) {
        for (let y = -10; y < 10; y ++) {

          let x_off = x * 4 + 2 * ( y % 2 ) ; 
          let y_off = y * 3; 

          // objects
          this.square_geom = new THREE.Geometry();
          this.square_geom.vertices.push(new THREE.Vector3(0, 0, 0), 
                                        new THREE.Vector3(2, -1, 0),
                                        new THREE.Vector3(4, 0, 0), 
                                        new THREE.Vector3(2, 1, 0) );
          this.square_geom.faces.push( new THREE.Face3(0, 1, 2),
                                      new THREE.Face3(0, 2, 3));
          
          this.material_1 = new THREE.MeshBasicMaterial( {color: 0xaaaaaa} );
          this.square_mesh1 = new THREE.Mesh( this.square_geom, this.material_1)
          this.three_scene.add(  this.square_mesh1 );

          this.square_geom2 = new THREE.Geometry();
          this.square_geom2.vertices.push(new THREE.Vector3(2, 1, 0), 
                                        new THREE.Vector3(4, 0, 0),
                                        new THREE.Vector3(4, 2, 0), 
                                        new THREE.Vector3(2, 3, 0) );
          this.square_geom2.faces.push( new THREE.Face3(0, 1, 2),
                                      new THREE.Face3(0, 2, 3));
          
          this.material_2 = new THREE.MeshBasicMaterial( {color: 0xcccccc} );
          //let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
          this.square_mesh2 = new THREE.Mesh( this.square_geom2, this.material_2)
          this.three_scene.add(  this.square_mesh2 );

          this.square_geom3 = new THREE.Geometry();
          this.square_geom3.vertices.push(new THREE.Vector3(0, 0, 0), 
                                          new THREE.Vector3(2, 1, 0),
                                          new THREE.Vector3(2, 3, 0), 
                                          new THREE.Vector3(0, 2, 0) );
          this.square_geom3.faces.push( new THREE.Face3(0, 1, 2),
                                      new THREE.Face3(0, 2, 3));


          

          this.material_3 = new THREE.MeshBasicMaterial( {color: 0xeeeeee} );
          //let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
          this.square_mesh3 = new THREE.Mesh( this.square_geom3, this.material_3)
          
          this.square_mesh1.position.x = x_off;
          this.square_mesh1.position.y = y_off;
          this.square_mesh2.position.x = x_off;
          this.square_mesh2.position.y = y_off;
          this.square_mesh3.position.x = x_off;
          this.square_mesh3.position.y = y_off;
          this.three_scene.add(  this.square_mesh3 );

        }
      }



      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas_g, antialias: true, depth: true});
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      this.canvas = document.body.appendChild(this.renderer.domElement);
      


      this.last_update_time = null;

  }

  animLoop(cur_time_ms) {
    var me = this; // https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
    //window.requestAnimationFrame(function (cur_time) { me.drawAndUpdate(cur_time); });

    this.stats.begin();

    //update
    if(this.last_update_time_ms != null){
        var d_time_ms = cur_time_ms - this.last_update_time_ms
    }
    this.last_update_time_ms = cur_time_ms;

    // draw
    window.requestAnimationFrame(function (cur_time) { me.animLoop(cur_time); });
    this.render();

    this.stats.end();

  }

  render() {
    

    this.renderer.render(this.three_scene, this.THREEcamera)

  }
      




  _raycastMouseToTile(e){
    // some raycasting to deterimine the active tile.
    this.mouse_position.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse_position.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse_position, this.camera.THREEcamera);
    var intersects = this.raycaster.intersectObjects( this.three_scene.children );

    return intersects.map(x => x.object.name);
  }


  onmousemove(e) {
    //console.log(" onmousemove : " + e.x + " " + e.y)
    console.log(" onmousemove : ")
  }

  onmousedown(e) {
    console.log(" onmousedown : " + e.x + " " + e.y)
  }
  onmouseup(e) {
    console.log(" onmouseup : " + e.x + " " + e.y)
    // var game_object_ids = this._raycastMouseToTile(e);
  }

  keyDown(e){
    console.log(" keyDown : "+ e.x + " " + e.y)
  }

  keyUp(e){
    console.log(" keyUp : "+ e.x + " " + e.y)
  }

  wheel(e){
      console.log(" w " + e.deltaX + " " + e.deltaY + " " + e.deltaZ + " " + e.deltaMode)
  }

  handleEvent(evt) {
      //console.log("event type " + evt.type)
      switch (evt.type) {
          case "wheel":
              this.wheel(evt);
              break;
          case "keydown":
              this.keyDown(evt)
              break;
          case "mousemove":
              //mouse move also fires at click...
              this.onmousemove(evt);
              break;
          case "mousedown":
              this.onmousedown(evt);
              break;
          case "mouseup":
              this.onmouseup(evt);
              break;
          case "dblclick":
              break;
          case "keydown":
              this.keyDown(evt);
              break;
          case "keyup":
              this.keyUp(evt);
              break;
          default:
              return;
      }
  }


}
