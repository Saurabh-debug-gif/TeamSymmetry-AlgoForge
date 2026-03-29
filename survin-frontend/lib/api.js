import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

// Token automatically add karo har request mein
API.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth APIs
export const authAPI = {
    login: (data) => API.post("/api/auth/login", data),
    register: (data) => API.post("/api/auth/register", data),
};

// Doctor APIs
export const doctorAPI = {
    getAll: () => API.get("/api/doctor/profile/all"),
    getById: (id) => API.get(`/api/doctor/profile/${id}`),
    filter: (spec) => API.get(`/api/doctor/profile/filter?specialization=${spec}`),
    getProfile: () => API.get("/api/doctor/profile"),
    createProfile: (data) => API.post("/api/doctor/profile", data),
    updateProfile: (data) => API.put("/api/doctor/profile", data),
};

// Patient APIs
export const patientAPI = {
    getProfile: () => API.get("/api/patient/profile"),
    createProfile: (data) => API.post("/api/patient/profile", data),
    updateProfile: (data) => API.put("/api/patient/profile", data),
};

// Medicine APIs
export const medicineAPI = {
    getAll: () => API.get("/api/medicines"),
    create: (data) => API.post("/api/medicines", data),
    update: (id, data) => API.put(`/api/medicines/${id}`, data),
    delete: (id) => API.delete(`/api/medicines/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
    book: (data) => API.post("/api/appointments", data),
    getMyAppointments: () => API.get("/api/appointments/my"),
    getDoctorAppointments: () => API.get("/api/appointments/doctor"),
    update: (id, params) => API.put(`/api/appointments/${id}`, null, { params }),
};

// Review APIs
export const reviewAPI = {
    add: (data) => API.post("/api/reviews", data),
    getDoctorReviews: (id) => API.get(`/api/reviews/doctor/${id}`),
    getAvgRating: (id) => API.get(`/api/reviews/doctor/${id}/rating`),
};

// Admin APIs
export const adminAPI = {
    getStats: () => API.get("/api/admin/stats"),
    getAllUsers: () => API.get("/api/admin/users"),
    blockUser: (id) => API.put(`/api/admin/users/${id}/block`),
    unblockUser: (id) => API.put(`/api/admin/users/${id}/unblock`),
    verifyDoctor: (id) => API.put(`/api/admin/doctors/${id}/verify`),
};

export default API;