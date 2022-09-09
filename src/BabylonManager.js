import * as BABYLON from 'babylonjs';
import GameManger from './Babylon/GameManager';

export default function BabylonManager(canvasRef) {
  console.log("canvasRef", canvasRef)
  if (!canvasRef) {
    throw new Error("Canvas is not provided!");
  }
  const engine = new BABYLON.Engine(
    canvasRef,
    true,
  );

  const gManger = new GameManger(canvasRef, engine);

  return {
    gManger,
  };
}