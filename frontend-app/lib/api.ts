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

  // Lessons
  async getLessons(courseId: number) {
    return this.request<any[]>(`/courses/courses/${courseId}/lessons`);
  }

  async getLesson(id: number) {
    return this.request<any>(`/courses/lessons/${id}`);
  }

  async createLesson(lessonData: {
    course_id: number;
    title: string;
    content?: string;
    order_index?: number;
  }) {
    return this.request<any>('/courses/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  async updateLesson(id: number, lessonData: {
    title?: string;
    content?: string;
    order_index?: number;
  }) {
    return this.request<any>(`/courses/lessons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(lessonData),
    });
  }

  async deleteLesson(id: number) {
    return this.request<any>(`/courses/lessons/${id}`, {
      method: 'DELETE',
    });
  }

  // File Uploads
  async uploadVideo(lessonId: number, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('video', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/files/lessons/${lessonId}/video`, {
        method: 'POST',
        headers,
        body: formData,
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

  async uploadPdf(lessonId: number, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('pdf', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/files/lessons/${lessonId}/pdf`, {
        method: 'POST',
        headers,
        body: formData,
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

  getFileUrl(filename: string, type: 'video' | 'pdf'): string {
    return `${this.baseUrl}/files/${type}s/${filename}`;
  }

  // Lesson Progress
  async getLesson(lessonId: number) {
    return this.request<any>(`/lessons/${lessonId}`);
  }

  async updateLessonProgress(lessonId: number, data: {
    is_completed?: boolean;
    progress_percentage?: number;
    video_time_watched?: number;
  }) {
    return this.request<any>(`/lessons/${lessonId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateLessonNotes(lessonId: number, notes: string) {
    return this.request<any>(`/lessons/${lessonId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async getCourseProgress(courseId: number) {
    return this.request<any>(`/lessons/course/${courseId}/progress`);
  }
}

export const api = new ApiClient();

