import * as THREE from './assets/three.module.js';

const stops = [
  {word:'train', icon:'🚂', x:-6.8, z:1, description:'The train is blue. It runs on tracks.', color:0x2189af, route:0x867468,
    action:'Raise the signal', clue:'Walk to the train signal. Raise it to clear the track.',
    prompt:'Ask the station helper where the train goes.', sentence:'Where does the train go?'},
  {word:'school bus', icon:'🚌', x:-3.4, z:-2, description:'The school bus is yellow. It takes children to school.', color:0xf8bd29, route:0x555d72,
    action:'Open the school gate', clue:'Walk to the school gate. Open it for the school bus.',
    prompt:'What colour is the school bus? Answer in a sentence.', sentence:'The school bus is yellow.'},
  {word:'bicycle', icon:'🚲', x:0, z:1, description:'The bicycle has two wheels. I can pedal it.', color:0x333845, route:0xe3ae67,
    action:'Move the cone', clue:'Walk to the cycle path. Move the cone out of the bicycle’s way.',
    prompt:'Describe the bicycle. How many wheels does it have?', sentence:'The bicycle has two wheels.'},
  {word:'boat', icon:'🚤', x:3.4, z:-2, description:'The boat is red and white. It floats on water.', color:0xe74e65, route:0x63c4de,
    action:'Untie the boat', clue:'Walk to the dock. Untie the boat so it can cross the water.',
    prompt:'Where does the boat go? Answer in a sentence.', sentence:'The boat goes on the water.'},
  {word:'airplane', icon:'✈️', x:6.8, z:1, description:'The airplane has wings. It can fly high.', color:0xef7180, route:0x7776a3,
    action:'Turn on the runway lights', clue:'Walk to the runway switch. Turn on the lights for the airplane.',
    prompt:'Ask a question about where the airplane can go.', sentence:'Can the airplane fly over the town?'}
];
const finale = {word:'toy parade', icon:'🎉', x:0, z:-2.5, action:'Start the toy parade',
  clue:'All five routes are ready! Walk to the parade bell and ring it.',
  prompt:'Go pick up your favourite vehicle and describe it in your own words.',
  sentence:'I like the yellow school bus. It has four wheels. It goes to school.'};

export const TRANSPORTATION = {
  id:'mac-e5ffd6e65424dd64', title:'Transportation Toy Parade', setting:'playroom',
  intro:'The toys are getting ready for a parade. Will you help clear their routes?',
  ending:'You got every toy moving. Thanks for making the parade happen!',
  beats:[...stops, finale], adventure:true
};

export class TransportationWorld {
  constructor(scene, kit) {
    this.root = new THREE.Group();
    scene.add(this.root);
    const {cube,cyl,orb,rod,labelBoard} = kit;
    const ink = 0x323646;
    const cream = 0xfff2cf;
    cube(0x87bc65,0,-.26,0,20,.48,17,this.root);
    cube(0xf1ddbc,0,-.51,0,20.2,.13,17.2,this.root);
    const group = (parent,x=0,y=0,z=0) => {
      const child = new THREE.Group();
      child.position.set(x,y,z);
      parent.add(child);
      return child;
    };
    const wheel = (parent,x,y,z,r) => {
      const tire = cyl(ink,x,y,z,r,.11,parent);
      tire.rotation.x = Math.PI/2;
      orb(cream,x,y,z+.067,r*.43,r*.43,.028,parent);
    };
    this.routes = stops.map((stop,index) => {
      const {x,z,color,route} = stop;
      const lane = group(this.root,x,0,z);
      cube(route,0,.015,0,2.6,.06,3.9,lane);
      labelBoard(stop.word,0,1.18,-1.92,2.25,lane);
      for (let i=0;i<6;i++) {
        const markZ = -1.65+i*.61;
        if (index===0) cube(0xc8ab8a,0,.055,markZ,1.06,.025,.12,lane);
        else if (index!==3) cube(cream,0,.055,markZ,.07,.025,.24,lane);
      }
      if (index===0) for (const side of [-1,1]) cube(ink,side*.34,.08,0,.05,.055,3.9,lane);
      const toy = group(lane,0,.08,1.26);
      const body = group(toy);
      body.rotation.y = -Math.PI/2;
      if (index===0 || index===1) {
        cube(color,0,.36,0,1.14,.37,.64,body);
        cube(color,index===0?.19:.03,.62,0,index===0?.47:.91,.29,.60,body);
        for (const side of [-1,1]) {
          wheel(body,-.35,.15,side*.34,.16);
          wheel(body,.35,.15,side*.34,.16);
          for (let i=0;i<(index===0?1:3);i++) cube(0xbde6ed,index===0?.19:-.26+i*.26,.64,side*.31,.17,.15,.025,body);
        }
        if (index===0) {
          cyl(ink,-.36,.61,0,.09,.30,body);
          for (let i=0;i<3;i++) {
            const trailer = group(body,.87+i*.56,0,0);
            cube([0xd44b53,0x549adc,0xe8b844][i],0,.27,0,.50,.25,.53,trailer);
            for (const side of [-1,1]) wheel(trailer,0,.12,side*.28,.11);
          }
        }
      } else if (index===2) {
        wheel(body,-.42,.28,0,.27);
        wheel(body,.42,.28,0,.27);
        rod(color,[-.42,.28,0],[-.27,.78,0],.031,body);
        rod(color,[-.27,.78,0],[.08,.30,0],.031,body);
        rod(color,[.08,.30,0],[.42,.28,0],.031,body);
        rod(color,[.08,.30,0],[.30,.73,0],.031,body);
        rod(color,[-.27,.69,0],[.30,.73,0],.031,body);
        cube(ink,.30,.76,0,.25,.09,.17,body);
        rod(ink,[-.27,.78,-.20],[-.27,.78,.20],.031,body);
      } else if (index===3) {
        orb(color,0,.18,0,.71,.16,.36,body);
        orb(cream,-.03,.28,0,.64,.11,.31,body);
        cube(color,.15,.38,0,.49,.21,.49,body);
        cube(0xbde6ed,-.07,.42,0,.08,.13,.43,body);
      } else {
        orb(color,0,.33,0,.72,.16,.17,body);
        orb(cream,-.17,.44,0,.19,.10,.13,body);
        orb(color,.05,.32,0,.23,.045,.92,body);
        orb(color,.53,.39,0,.18,.045,.39,body);
        orb(color,.57,.48,0,.16,.18,.045,body);
      }
      const control = group(lane,.88,0,1.15);
      if (index<2) {
        cyl(cream,0,.34,0,.07,.68,control);
        cube(0xda5562,-.34,.64,0,.71,.11,.12,control);
      } else if (index===2) {
        cyl(0xec7339,0,.17,0,.17,.34,control);
        cyl(cream,0,.27,0,.18,.07,control);
      } else if (index===3) {
        cyl(cream,0,.18,0,.15,.36,control);
        rod(0xe8be86,[0,.30,0],[-.85,.26,.16],.035,control);
      } else {
        cyl(cream,0,.26,0,.16,.52,control);
        orb(0xd55562,0,.55,0,.14,.12,.14,control);
      }
      const light = orb(0x68e2a1,.88,.82,1.15,.13,.13,.13,lane);
      const runwayLights = group(lane);
      if (index===4) for (const side of [-1,1]) for (let i=0;i<6;i++) {
        orb(0xffe498,side*1.13,.11,-1.65+i*.61,.085,.085,.085,runwayLights);
      }
      const pickupMarker = new THREE.Mesh(new THREE.RingGeometry(.70,.87,40),new THREE.MeshBasicMaterial({color:0xffd45f,side:THREE.DoubleSide}));
      pickupMarker.rotation.x = -Math.PI/2;
      pickupMarker.position.set(0,.085,1.26);
      lane.add(pickupMarker);
      return {toy,control,light,runwayLights,pickupMarker};
    });
    // The smaller vehicles from the tabletop photo are parked behind their routes.
    for (const [x,z,color] of [[-4.7,-3.25,0x62ad84],[1.7,-3.25,0xcd8fce],[5.1,-3.25,0x819c9d]]) {
      const car = group(this.root,x,0,z);
      cube(color,0,.20,0,.65,.23,.39,car);
      cube(color,.05,.35,0,.42,.17,.36,car);
      for (const side of [-1,1]) for (const axle of [-.2,.2]) wheel(car,axle,.12,side*.21,.11);
    }
    this.bell = group(this.root,finale.x,0,finale.z-.65);
    cyl(0x77618d,0,.30,0,.24,.60,this.bell);
    orb(0xf9bd48,0,.78,0,.30,.29,.30,this.bell);
    labelBoard('Parade bell',0,1.38,-.18,2.2,this.bell);
    this.reset();
    this.root.visible = false;
  }

  get current() { return TRANSPORTATION.beats[this.index]; }

  reset() {
    this.index = 0;
    this.choosing = false;
    this.picked = null;
    this.effectTime = 0;
    this.timer = 0;
    this.bell.rotation.z = 0;
    this.root.visible = true;
    for (const {toy,control,light,runwayLights,pickupMarker} of this.routes) {
      toy.position.set(0,.08,1.26);
      toy.rotation.set(0,0,0);
      pickupMarker.visible = false;
      control.rotation.z = 0;
      control.position.x = .88;
      control.visible = true;
      light.visible = false;
      runwayLights.visible = false;
    }
  }

  target() {
    const {x,z} = this.current;
    const parade = this.index === stops.length;
    return new THREE.Vector3(x+(parade?0:.88),0,z+(parade?0:1.84));
  }

  nearestPickup(position) {
    let distance = 1.75;
    let nearest = null;
    for (const stop of stops) {
      const gap = Math.hypot(stop.x-position.x,stop.z+1.26-position.z);
      if (gap<distance) {
        distance = gap;
        nearest = stop;
      }
    }
    return nearest;
  }

  beginPickup() {
    this.choosing = true;
    for (const {pickupMarker} of this.routes) pickupMarker.visible = true;
  }

  pickUp(position) {
    const stop = this.choosing && this.nearestPickup(position);
    if (!stop) return false;
    this.choosing = false;
    this.picked = stop;
    for (const {pickupMarker} of this.routes) pickupMarker.visible = false;
    this.effectTime = this.timer = 1.25;
    return true;
  }

  frame(camera, position, focus) {
    const wide = !this.picked && this.index===stops.length;
    const {x,z} = this.picked || this.current;
    const height = wide?1:this.picked?1.05:this.index===4?1.3:.65;
    focus.set(wide?0:x,height,wide?-.4:z+(this.picked?1.26:this.index===0?.7:0));
    const width = wide?10:this.picked?2.55:2.85;
    const distance = Math.max(wide?16:this.picked?6.3:this.index===0?8:this.index===4?7.4:6.1,width/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
    const angle = wide?0:.42;
    position.copy(focus).add(new THREE.Vector3(Math.sin(angle)*distance*.75,distance*.66,Math.cos(angle)*distance*.75));
  }

  interact(position) {
    if (this.timer || position.clone().setY(0).distanceTo(this.target())>=1.75) return false;
    const route = this.routes[this.index];
    if (route) route.light.visible = true;
    this.effectTime = this.timer = this.index===stops.length?5.2:3.7;
    return true;
  }

  tick(dt, paused) {
    if (!this.root.visible || !this.timer || paused) return false;
    this.timer = Math.max(0,this.timer-dt);
    const fraction = 1-this.timer/this.effectTime;
    if (this.picked) {
      const {toy} = this.routes[stops.indexOf(this.picked)];
      const lift = THREE.MathUtils.smoothstep(fraction,0,.6);
      toy.position.y = .08+lift*1.10;
      toy.rotation.y = .8*lift;
    } else if (this.index === stops.length) {
      this.bell.rotation.z = Math.sin(fraction*40)*(1-fraction)*.42;
      this.routes.forEach(({toy},i) => {
        const roll = THREE.MathUtils.smoothstep(fraction,i*.045,.93);
        toy.position.z = THREE.MathUtils.lerp(-1.65,1.26,roll);
        toy.position.y = .08+Math.sin(Math.PI*roll)*(i===4?2.8:i===3?.29:.13);
        toy.rotation.y = (1-THREE.MathUtils.smoothstep(fraction, .92,1))*Math.PI;
      });
    } else {
      const {toy,control,runwayLights} = this.routes[this.index];
      const release = THREE.MathUtils.smoothstep(fraction,.06,.28);
      const travel = THREE.MathUtils.smoothstep(fraction,.24,.90);
      if (this.index<2) control.rotation.z = -release*1.54;
      if (this.index===2) control.position.x = .88+release*.78;
      if (this.index===3) control.visible = release<.66;
      if (this.index===4) runwayLights.visible = release>.36;
      const arc = Math.sin(travel*Math.PI);
      toy.position.z = THREE.MathUtils.lerp(1.26,-1.65,travel);
      toy.position.y = .08+arc*(this.index===4?2.8:this.index===3?.23:.11);
      toy.rotation.z = arc*Math.sin(travel*11)*(this.index===4?.4:this.index===2?.25:.11);
    }
    if (this.timer) return false;
    this.effectTime = 0;
    return true;
  }
}
