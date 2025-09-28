import axios from "axios";

const SUPABASE_URL = "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE";

export const API_ENDPOINTS = {
  TASKS: "tasks",
  CATEGORIES: "categories",
};

const apiClient = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  timeout: 10000,
});

export const api = apiClient;
