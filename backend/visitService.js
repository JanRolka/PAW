import { FirebaseBackend } from "./firebase/FireBaseBackend";
import { ServerBackend } from "./server/ServerBackend";

let backendInstance;

export const initBackend = (type) => {
  if (type === "firebase") backendInstance = new FirebaseBackend();
  else if (type === "server") backendInstance = new ServerBackend();
  else throw new Error("Unknown backend type");
};

export const getVisits = () => backendInstance.getVisits();

export const getVisitsByUser = (userId) =>
  backendInstance.getVisitsByUser(userId);

export const addVisit = (visit) =>
  backendInstance.addVisit(visit);

export const deleteVisit = (id) =>
  backendInstance.deleteVisit(id);
