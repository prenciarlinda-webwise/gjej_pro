const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8765/api";

export type Role = "admin" | "freelancer" | "klient";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: Role;
  is_email_verified: boolean;
  preferred_language: string;
  country: string;
  date_joined: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface FreelancerProfile {
  headline: string;
  bio: string;
  years_experience: number | null;
  hourly_rate_min: string | null;
  hourly_rate_max: string | null;
  currency: string;
  company_name: string;
  avg_rating: string;
  review_count: number;
  is_verified: boolean;
  avatar_url: string;
}

export interface KlientProfile {
  default_address: string;
  city: string;
  avatar_url: string;
}

export interface ProfilePayload<P = unknown> {
  user: User;
  profile: P;
  completion: number;
}

export interface Category {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  icon: string;
  parent: number | null;
  sort_order: number;
  freelancer_count?: number;
  updated_at?: string;
}

export interface RateBenchmark {
  currency: string;
  sample_size: number;
  median: number | null;
  p25: number | null;
  scope: "city" | "country" | "global" | "insufficient";
}

export type PricingModel = "hourly" | "fixed" | "quote";

export interface Service {
  id: number;
  title: string;
  description: string;
  category: Category;
  pricing_model: PricingModel;
  pricing_model_label: string;
  price_min: string | null;
  price_max: string | null;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface ServiceWriteBody {
  title: string;
  description?: string;
  category_id: number;
  pricing_model: PricingModel;
  price_min?: string | null;
  price_max?: string | null;
  currency?: string;
  is_active?: boolean;
}

export interface ServiceArea {
  id: number;
  country: string;
  region: string;
  city: string;
  created_at: string;
}

export interface FreelancerListItem {
  id: number;
  slug: string;
  full_name: string;
  headline: string;
  company_name: string;
  years_experience: number | null;
  hourly_rate_min: string | null;
  hourly_rate_max: string | null;
  currency: string;
  avg_rating: string;
  review_count: number;
  is_verified: boolean;
  avatar_url: string;
  cities: string[];
  categories: { id: number; name: string; slug: string }[];
  updated_at?: string;
}

export interface FreelancerDetail extends FreelancerListItem {
  bio: string;
  services: Service[];
  service_areas: ServiceArea[];
  member_since: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ----- Jobs & Quotes -----

export type JobStatus = "open" | "in_progress" | "completed" | "cancelled";
export type QuoteStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface MyJobListItem {
  id: number;
  title: string;
  description: string;
  category: Category;
  city: string;
  address: string;
  country: string;
  budget_min: string | null;
  budget_max: string | null;
  currency: string;
  status: JobStatus;
  status_label: string;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  quote_count: number;
}

export interface QuoteOnJob {
  id: number;
  price: string;
  currency: string;
  message: string;
  status: QuoteStatus;
  status_label: string;
  created_at: string;
  freelancer_id: number;
  freelancer_slug: string;
  freelancer_name: string;
  freelancer_headline: string;
  freelancer_avg_rating: string;
  freelancer_review_count: number;
  freelancer_is_verified: boolean;
}

export interface MyReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_first_name: string;
  job_title: string;
  job_category: string;
}

export interface MyJobDetail extends MyJobListItem {
  quotes: QuoteOnJob[];
  accepted_quote_id: number | null;
  my_review: MyReview | null;
  can_review: boolean;
}

export interface JobWriteBody {
  title: string;
  description: string;
  category_id: number;
  city: string;
  address?: string;
  budget_min?: string | null;
  budget_max?: string | null;
  currency?: string;
  scheduled_at?: string | null;
}

export interface OpenJobListItem {
  id: number;
  title: string;
  category: Category;
  city: string;
  budget_min: string | null;
  budget_max: string | null;
  currency: string;
  scheduled_at: string | null;
  created_at: string;
  customer_name: string;
  quote_count: number;
}

export interface MyQuote {
  id: number;
  price: string;
  currency: string;
  message: string;
  status: QuoteStatus;
  status_label: string;
  created_at: string;
  updated_at: string;
  job_id: number;
  job_title: string;
  job_status: JobStatus;
  job_city: string;
}

export interface OpenJobDetail extends OpenJobListItem {
  description: string;
  address: string;
  status: JobStatus;
  customer_id: number;
  my_quote: MyQuote | null;
}

export interface QuoteWriteBody {
  price: string | number;
  currency?: string;
  message: string;
}

// ----- Notification Preferences -----

export interface NotificationPreferences {
  email_quote_received: boolean;
  email_quote_accepted: boolean;
  email_quote_rejected: boolean;
  email_message_received: boolean;
  email_review_received: boolean;
  email_job_completed: boolean;
  email_job_cancelled: boolean;
  updated_at: string;
}

// ----- Notifications -----

export type NotificationKind =
  | "quote_received"
  | "quote_accepted"
  | "quote_rejected"
  | "message_received"
  | "review_received"
  | "job_completed"
  | "job_cancelled";

export interface NotificationItem {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  link: string;
  actor_name: string;
  read_at: string | null;
  created_at: string;
}

// ----- Messaging -----

export interface MessagePeer {
  id: number;
  slug: string;
  full_name: string;
  role: Role;
  headline: string;
  avatar_url: string;
}

export interface MessageItem {
  id: number;
  body: string;
  sender_id: number;
  read_at: string | null;
  created_at: string;
}

export interface ConversationListItem {
  id: number;
  peer: MessagePeer;
  last_message: { body: string; sender_id: number; created_at: string } | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface ConversationDetail {
  id: number;
  peer: MessagePeer;
  messages: MessageItem[];
  created_at: string;
}

export interface ConversationListResponse {
  results: ConversationListItem[];
  total_unread: number;
}

export interface AdminStats {
  totals: {
    all_users: number;
    freelancers: number;
    klients: number;
    admins: number;
  };
  signups: {
    today: number;
    last_7_days: number;
  };
  recent: User[];
}

export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;

  constructor(message: string, status: number, fields: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

const ACCESS_KEY = "gjp_access";
const REFRESH_KEY = "gjp_refresh";

export const tokenStore = {
  getAccess: () =>
    typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY),
  getRefresh: () =>
    typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

async function rawFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (init.auth !== false) {
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 204) return undefined as T;

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const fields = (typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {}) as Record<string, string[] | string>;
    const detail =
      (fields.detail as string) ??
      Object.values(fields).flat().filter(Boolean).join(" ") ??
      "Diçka shkoi keq.";
    const normalized: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(fields)) {
      normalized[k] = Array.isArray(v) ? v : [String(v)];
    }
    throw new ApiError(detail, res.status, normalized);
  }
  return body as T;
}

export const api = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: "freelancer" | "klient";
    company_name?: string;
  }) =>
    rawFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    }),

  login: (email: string, password: string) =>
    rawFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),

  me: () => rawFetch<User>("/auth/me/"),

  adminStats: () => rawFetch<AdminStats>("/admin/stats/"),

  verifyEmail: (token: string) =>
    rawFetch<{ detail: string; email?: string; already?: boolean }>(
      "/auth/verify-email/",
      {
        method: "POST",
        body: JSON.stringify({ token }),
        auth: false,
      },
    ),

  resendVerification: () =>
    rawFetch<{ detail: string }>("/auth/resend-verification/", {
      method: "POST",
    }),

  requestPasswordReset: (email: string) =>
    rawFetch<{ detail: string }>("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
      auth: false,
    }),

  confirmPasswordReset: (token: string, password: string) =>
    rawFetch<{ detail: string }>("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      auth: false,
    }),

  myProfile: <P = FreelancerProfile | KlientProfile>() =>
    rawFetch<ProfilePayload<P>>("/profile/me/"),

  patchProfile: <P = FreelancerProfile | KlientProfile>(
    body: Record<string, unknown>,
  ) =>
    rawFetch<ProfilePayload<P>>("/profile/me/", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  categories: () => rawFetch<Category[]>("/categories/", { auth: false }),

  getRateBenchmark: (params: {
    category: string;
    city?: string;
    country?: string;
    currency?: string;
  }) => {
    const qs = new URLSearchParams();
    qs.set("category", params.category);
    if (params.city) qs.set("city", params.city);
    if (params.country) qs.set("country", params.country);
    if (params.currency) qs.set("currency", params.currency);
    return rawFetch<RateBenchmark>(`/rate-benchmark/?${qs.toString()}`, {
      auth: false,
    });
  },

  // Services (freelancer's own)
  myServices: () => rawFetch<Service[]>("/me/services/"),
  createService: (body: ServiceWriteBody) =>
    rawFetch<Service>("/me/services/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateService: (id: number, body: Partial<ServiceWriteBody>) =>
    rawFetch<Service>(`/me/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteService: (id: number) =>
    rawFetch<void>(`/me/services/${id}/`, { method: "DELETE" }),

  // Service Areas (freelancer's own)
  myServiceAreas: () => rawFetch<ServiceArea[]>("/me/service-areas/"),
  createServiceArea: (body: { city: string; region?: string; country?: string }) =>
    rawFetch<ServiceArea>("/me/service-areas/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteServiceArea: (id: number) =>
    rawFetch<void>(`/me/service-areas/${id}/`, { method: "DELETE" }),

  // Public freelancer browse + detail
  searchFreelancers: (params: {
    q?: string;
    category?: string;
    city?: string;
    verified?: boolean;
    lat?: number;
    lng?: number;
    radius_km?: number;
    page?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.city) sp.set("city", params.city);
    if (params.verified) sp.set("verified", "1");
    if (params.lat !== undefined && params.lng !== undefined) {
      sp.set("lat", String(params.lat));
      sp.set("lng", String(params.lng));
      if (params.radius_km !== undefined) {
        sp.set("radius_km", String(params.radius_km));
      }
    }
    if (params.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<FreelancerListItem>>(
      `/freelancers/${qs ? `?${qs}` : ""}`,
      { auth: false },
    );
  },
  freelancer: (id: number) =>
    rawFetch<FreelancerDetail>(`/freelancers/${id}/`, { auth: false }),

  // Jobs (klient = customer side)
  myJobs: (params: { page?: number } = {}) => {
    const sp = new URLSearchParams();
    if (params.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<MyJobListItem>>(
      `/me/jobs/${qs ? `?${qs}` : ""}`,
    );
  },
  getMyJob: (id: number) => rawFetch<MyJobDetail>(`/me/jobs/${id}/`),
  createJob: (body: JobWriteBody) =>
    rawFetch<MyJobListItem>("/me/jobs/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateJob: (id: number, body: Partial<JobWriteBody>) =>
    rawFetch<MyJobListItem>(`/me/jobs/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  cancelJob: (id: number) =>
    rawFetch<MyJobDetail>(`/me/jobs/${id}/cancel/`, { method: "POST" }),
  completeJob: (id: number) =>
    rawFetch<MyJobDetail>(`/me/jobs/${id}/complete/`, { method: "POST" }),
  acceptQuote: (jobId: number, quoteId: number) =>
    rawFetch<MyJobDetail>(
      `/me/jobs/${jobId}/quotes/${quoteId}/accept/`,
      { method: "POST" },
    ),

  // Open jobs (freelancer side)
  openJobs: (params: {
    q?: string;
    category?: string;
    city?: string;
    mine_only?: boolean;
    page?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.city) sp.set("city", params.city);
    if (params.mine_only) sp.set("mine_only", "1");
    if (params.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<OpenJobListItem>>(
      `/jobs/${qs ? `?${qs}` : ""}`,
    );
  },
  getOpenJob: (id: number) => rawFetch<OpenJobDetail>(`/jobs/${id}/`),
  submitQuote: (jobId: number, body: QuoteWriteBody) =>
    rawFetch<MyQuote>(`/jobs/${jobId}/quote/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // My quotes (freelancer)
  myQuotes: () => rawFetch<MyQuote[]>("/me/quotes/"),
  updateQuote: (id: number, body: Partial<QuoteWriteBody>) =>
    rawFetch<MyQuote>(`/me/quotes/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  withdrawQuote: (id: number) =>
    rawFetch<void>(`/me/quotes/${id}/`, { method: "DELETE" }),

  // Reviews
  postReview: (body: { job_id: number; rating: number; comment?: string }) =>
    rawFetch<ReviewItem>("/reviews/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  freelancerReviews: (id: number, page = 1) => {
    const sp = new URLSearchParams();
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<ReviewItem>>(
      `/freelancers/${id}/reviews/${qs ? `?${qs}` : ""}`,
      { auth: false },
    );
  },

  // Notifications
  notifications: (page = 1) => {
    const sp = new URLSearchParams();
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<NotificationItem>>(
      `/notifications/${qs ? `?${qs}` : ""}`,
    );
  },
  notificationsUnreadCount: () =>
    rawFetch<{ unread_count: number }>("/notifications/unread-count/"),
  markNotificationRead: (id: number) =>
    rawFetch<NotificationItem>(`/notifications/${id}/read/`, { method: "POST" }),
  markAllNotificationsRead: () =>
    rawFetch<{ updated: number }>("/notifications/read-all/", { method: "POST" }),

  notificationPreferences: () =>
    rawFetch<NotificationPreferences>("/me/notification-preferences/"),
  updateNotificationPreferences: (
    body: Partial<Omit<NotificationPreferences, "updated_at">>,
  ) =>
    rawFetch<NotificationPreferences>("/me/notification-preferences/", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Messaging
  conversations: () => rawFetch<ConversationListResponse>("/conversations/"),
  startConversation: (peer_id: number) =>
    rawFetch<ConversationDetail>("/conversations/", {
      method: "POST",
      body: JSON.stringify({ peer_id }),
    }),
  conversation: (id: number) =>
    rawFetch<ConversationDetail>(`/conversations/${id}/`),
  sendMessage: (id: number, body: string) =>
    rawFetch<MessageItem>(`/conversations/${id}/messages/`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
  markRead: (id: number) =>
    rawFetch<{ updated: number }>(`/conversations/${id}/read/`, {
      method: "POST",
    }),

  // Admin user list
  adminUsers: (params: { q?: string; role?: Role; page?: number }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.role) sp.set("role", params.role);
    if (params.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return rawFetch<PaginatedResponse<User>>(
      `/admin/users/${qs ? `?${qs}` : ""}`,
    );
  },
};

export function dashboardPathFor(role: Role): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "freelancer":
      return "/dashboard/freelancer";
    case "klient":
      return "/dashboard/klient";
  }
}
