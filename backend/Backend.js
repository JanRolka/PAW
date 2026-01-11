export class Backend {
  /* =========================
     AUTHENTICATION
     ========================= */

  async registerPatient(email, password, patientData){
    throw new Error("registerPatient() not implemented");
  }

  async login(login, password) {
    throw new Error("login() not implemented");
  }

  async logout() {
    throw new Error("logout() not implemented");
  }

  async getCurrentUser() {
    throw new Error("getCurrentUser() not implemented");
  }

  /* =========================
     USERS
     ========================= */

  async getUsers() {
    throw new Error("getUsers() not implemented");
  }

  async getUserById(id) {
    throw new Error("getUserById() not implemented");
  }

  async addUser(user) {
    throw new Error("addUser() not implemented");
  }

  async updateUser(id, data) {
    throw new Error("updateUser() not implemented");
  }

  async deleteUser(id) {
    throw new Error("deleteUser() not implemented");
  }

  async getDoctors(){
    throw new Error("deleteUser() not implemented");
  }

  async getDoctorsById(){
    throw new Error("getDoctorsById() not implemented");
  }


  /* =========================
     VISITS
     ========================= */

  async getVisits() {
    throw new Error("getVisits() not implemented");
  }

  async getVisitsByPatient(userId) {
    throw new Error("getVisitsByUser() not implemented");
  }

  async addVisit(visit) {
    throw new Error("addVisit() not implemented");
  }

  async deleteVisit(id) {
    throw new Error("deleteVisit() not implemented");
  }

  async getAbsentDaysByDoctor(doctorId) {
    throw new Error("getAbsentDaysByDoctor() not implemented");
  }

  async addAbsentDay(doctorId, data) {
    throw new Error("addAbsentDay() not implemented");
  }

  async deleteAbsentDay(id) {
    throw new Error("deleteAbsentDay() not implemented");
  }
}
