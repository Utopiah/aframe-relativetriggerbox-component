if (typeof AFRAME === 'undefined') {
	throw new Error('Component attempted to register before AFRAME was available.');
}
/**
 * Trigger box, emit an event on the moving entity once it enters and leaves a predefined area
 *
 * Usage <camera triggerbox="triggereventname: mytriggerbox" /> will make a 10x10x10 box
 * will emits event mytriggerbox_entered once the camera moves in
 * and event mytriggerbox_entered once the camera leaves it.
 *
 * It can also be used on other entity e.g. an enemy or a bonus.
 *
 * inspired by https://github.com/atomicguy/aframe-fence-component/
 *
 */
AFRAME.registerComponent('relativetriggerbox', {
  schema: {
      width: {
          type: 'number',
          default: 1
      },
      height: {
          type: 'number',
          default: 1
      },
      depth: {
          type: 'number',
          default: 1
      },
      elementid: {
          type: 'string',
          default: 'camera'
      },
      triggereventname: {
          type: 'string',
          default: 'relativetriggerbox'
      }
  },
  init: function() {
      // we don't know yet where we are
      this.lastestateset = false;
      this.laststateinthetriggerbox = false;
  },
  tick: function() {
      // gathering all the data
      var data = this.data;
      var thiswidth = data.width;
      var thisheight = data.height;
      var thisdepth = data.depth;
      var elementid = data.elementid;
      var triggereventname = data.triggereventname;
      var lastestateset = this.lastestateset;
      var laststateinthetriggerbox = this.laststateinthetriggerbox;

      var element = document.getElementById(elementid);
      var elementposition = element.getComputedAttribute('position');
      var x0 = elementposition.x0;
      var y0 = elementposition.y0;
      var z0 = elementposition.z0;

      //done here assuming the box size and position can change since init
      minX = thiswidth / 2 + x0;
      maxX = ( -1 * thiswidth / 2 ) + x0;
      minY = thisheight / 2 + y0;
      maxY = ( -1 * thisheight / 2 ) + y0;
      minZ = thisdepth / 2 + z0;
      maxZ = ( -1 * thisdepth / 2 ) + z0;

      var position = this.el.getComputedAttribute('position');
      if (( minX > position.x) && (maxX < position.x) 
          && ( minY > position.y) && ( maxY < position.y)
          && ( minZ > position.z) && ( maxZ < position.z)){
	// we are in
        if (lastestateset){
	  // we were not before
          if (!laststateinthetriggerbox) {
            var event = new Event(triggereventname+'_entered'); this.el.dispatchEvent(event);
          }
        }
        this.laststateinthetriggerbox = true;
      } else {
	// we are out
        if (lastestateset){
          if (laststateinthetriggerbox) {
	  // we were not before
            var event = new Event(triggereventname+'_exited'); this.el.dispatchEvent(event);
          }
        }
        this.laststateinthetriggerbox = false;
      }
      this.lastestateset = true;
  },

});
