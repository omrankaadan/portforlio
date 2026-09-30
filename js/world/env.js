import * as THREE from "three";
import { P } from "../palette.js";

export function buildEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.env.bg);

  const box = new THREE.BoxGeometry();
  box.deleteAttribute("uv");
  const plane = new THREE.PlaneGeometry();
  plane.deleteAttribute("uv");

  const add = (geo, color, pos, scale, rot) => {
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
    );
    m.position.set(pos[0], pos[1], pos[2]);
    m.scale.set(scale[0], scale[1], scale[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    scene.add(m);
    return m;
  };

  add(box, P.probe.shell, [0, 0, 0], [14, 8, 14]);
  add(box, P.probe.ceiling, [0, 3.98, 0], [14, 0.2, 14]);

  add(plane, P.probe.windowWarm, [-5.2, 1.4, -2.2], [4.6, 3.6, 1], [0, Math.PI / 2.2, 0]);
  add(plane, P.probe.windowSky, [-5.6, 1.4, -2.2], [3.4, 2.8, 1], [0, Math.PI / 2, 0]);
  add(plane, P.probe.windowBase, [-6.4, 0.2, 1.2], [5, 1.1, 1], [0, Math.PI / 2, 0]);

  add(plane, P.probe.lampWarm, [3.4, 2.2, 2.6], [2.2, 1.1, 1], [0, -Math.PI / 3, 0]);
  add(plane, P.probe.furniture, [3.9, 1.0, 2.2], [3, 2.4, 1], [0, -Math.PI / 3, 0]);

  add(plane, P.probe.ground, [0, -3.2, 0], [12, 12, 1], [-Math.PI / 2, 0, 0]);

  const target = pmrem.fromScene(scene, 0.02);
  pmrem.dispose();
  scene.traverse((o) => {
    if (o.isMesh) o.material.dispose();
  });
  box.dispose();
  plane.dispose();

  return target.texture;
}
