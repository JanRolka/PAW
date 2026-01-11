import { Backend } from "../Backend.js";

export class ServerBackend extends Backend {
  constructor(baseUrl = "http://localhost:5000/api") {
    super();
    this.baseUrl = baseUrl;
  }

  /* ==================== USERS ==================== */

  async getUsers() {
    return this.request("/users").then(list => list.map(this.mapUser));
  }

  async getUserById(id) {
    return this.request(`/users/${id}`).then(this.mapUser);
  }

  async addUser(user) {
    return this.request("/users", "POST", user).then(this.mapUser);
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, "PUT", data).then(this.mapUser);
  }

  async deleteUser(id) {
    await this.request(`/users/${id}`, "DELETE");
    return true;
  }

  /* ==================== VISITS ==================== */

  async getVisits() {
    return this.request("/visits").then(list => list.map(this.mapVisit));
  }

  async getVisitsByUser(userId) {
    return this.request(`/visits/user/${userId}`)
      .then(list => list.map(this.mapVisit));
  }

  async addVisit(visit) {
    return this.request("/visits", "POST", visit).then(this.mapVisit);
  }

  /* ==================== HELPERS ==================== */

  async request(path, method = "GET", body) {
    const res = await fetch(this.baseUrl + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error (${res.status}): ${text}`);
    }

    return res.status === 204 ? null : res.json();
  }

  mapUser = (u) => ({
    id: u._id,
    surname: u.surname,
    login: u.login,
    password: u.password,
    role: u.role
  });

  mapVisit = (v) => ({
    id: v._id,
    date: v.date,
    patientId: v.patientId,
    doctorId: v.doctorId,
    description: v.description
  });
}
