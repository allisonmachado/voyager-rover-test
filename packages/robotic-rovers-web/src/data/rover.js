import { getRequestOptions } from "@/utils/request";
import { getUrlFor } from "@/utils/url";

export async function listRoversByPlateau(plateauId) {
  const requestPath = getUrlFor(`plateaus/${plateauId}/robotic-rovers`);
  const requestOptions = getRequestOptions();

  const response = await fetch(requestPath, requestOptions);

  return response.json();
}

export async function sendMoveInstructions(roverId, instructions) {
  const requestOptions = getRequestOptions({
    method: "POST",
    body: instructions,
  });
  const requestPath = getUrlFor(`robotic-rovers/${roverId}/move-instructions`);

  const response = await fetch(requestPath, requestOptions);

  return response;
}

export async function deleteRover(roverId) {
  const requestOptions = getRequestOptions({
    method: "DELETE",
  });
  const requestPath = getUrlFor(`robotic-rovers/${roverId}`);

  const response = await fetch(requestPath, requestOptions);

  return response;
}

export async function createRoboticRover(plateauId, rover) {
  const requestOptions = getRequestOptions({
    method: "POST",
    body: rover,
  });
  const requestPath = getUrlFor(`plateaus/${plateauId}/robotic-rovers`);

  const response = await fetch(requestPath, requestOptions);

  return response;
}
