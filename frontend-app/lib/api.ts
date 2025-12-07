// URL de la API backend
// En producción: https://apilearning.getdevtools.com
// En desarrollo: http://localhost:3000
const API_URL = 
  typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'https://apilearning.getdevtools.com')
    : (process.env.NEXT_PUBLIC_API_URL || 'https://apilearning.getdevtools.com');

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `Error ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  }

  // Auth
  async register(userData: {
    dni: string;
    full_name: string;
    email: string;
    password: string;
  }) {
    return this.request<{ access_token: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async getProfile() {
    return this.request<any>('/auth/profile', {
      method: 'POST',
    });
  }

  // Courses
  async getCourses() {
    return this.request<any[]>('/courses');
  }

  async getCourse(id: number) {
    return this.request<any>(`/courses/${id}`);
  }

  async getCareers() {
    return this.request<any[]>('/courses/careers');
  }

  async getCareer(id: number) {
    return this.request<any>(`/courses/careers/${id}`);
  }

  // Submissions
  async createSubmission(courseId: number, projectUrl: string) {
    return this.request<any>('/submissions', {
      method: 'POST',
      body: JSON.stringify({
        course_id: courseId,
        project_url: projectUrl,
      }),
    });
  }

  async getSubmissions() {
    return this.request<any[]>('/submissions');
  }

  async getSubmission(id: number) {
    return this.request<any>(`/submissions/${id}`);
  }

  async getEvaluation(submissionId: number) {
    return this.request<any>(`/submissions/${submissionId}/evaluation`);
  }

  // Certificates
  async getCertificates() {
    return this.request<any[]>('/certificates');
  }

  async generateCourseCertificate(courseId: number) {
    return this.request<any>(`/certificates/course/${courseId}`, {
      method: 'POST',
    });
  }

  async generateCareerCertificate(careerId: number) {
    return this.request<any>(`/certificates/career/${careerId}`, {
      method: 'POST',
    });
  }

  // Access
  async getMyAccess() {
    return this.request<any[]>('/access/me');
  }

  async checkAccess(courseId: number) {
    return this.request<{ hasAccess: boolean }>(
      `/access/check/${courseId}`
    );
  }

  // Admin & Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: number) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUser(id: number, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Course Management
  async createCourse(courseData: any) {
    return this.request<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: number, courseData: any) {
    return this.request<any>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: number) {
    return this.request<any>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async createCareer(careerData: any) {
    return this.request<any>('/courses/careers', {
      method: 'POST',
      body: JSON.stringify(careerData),
    });
  }

  async updateCareer(id: number, careerData: any) {
    return this.request<any>(`/courses/careers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(careerData),
    });
  }

  async deleteCareer(id: number) {
    return this.request<any>(`/courses/careers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();

