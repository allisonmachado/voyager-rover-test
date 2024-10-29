import { getRequestOptions } from "@/utils/request";
import { getUrlFor } from "@/utils/url";
import { redirect } from "next/navigation";

export async function listAllPlateaus() {
  const requestPath = getUrlFor("plateaus");
  const requestOptions = getRequestOptions();

  const response = await fetch(requestPath, requestOptions);

  return response.json();
}

export async function findPlateauOrRedirect(id, redirectPath = "/not-found") {
  const requestPath = getUrlFor(`plateaus/${id}`);
  const requestOptions = getRequestOptions();

  const response = await fetch(requestPath, requestOptions);

  if (!response.ok) {
    return redirect(redirectPath);
  }

  return response.json();
}

export async function deletePlateau(plateauId) {
  const requestOptions = getRequestOptions({
    method: "DELETE",
  });
  const requestPath = getUrlFor(`plateaus/${plateauId}`);

  const response = await fetch(requestPath, requestOptions);

  return response;
}

export async function createPlateau(plateau) {
  const requestOptions = getRequestOptions({
    method: "POST",
    body: plateau,
  });
  const requestPath = getUrlFor("plateaus");

  const response = await fetch(requestPath, requestOptions);

  return response;
}
