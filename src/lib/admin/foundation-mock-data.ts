export interface MockUser {
  id: string;
  phone: string | null;
  email: string | null;
  role: "admin" | "user";
  status: "active" | "disabled" | "deleted";
  createdAt: string;
}

export interface MockLoginEvent {
  id: string;
  eventType: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "OTP_REQUESTED";
  failureReason: string | null;
  ip: string | null;
  userAgent: string | null;
  deviceId: string | null;
  occurredAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "87a4332b-cf39-41e4-b1fd-917f1ab57e86",
    phone: "+84912345678",
    email: "admin@auth.local",
    role: "admin",
    status: "active",
    createdAt: "2026-02-10T08:00:00.000Z"
  },
  {
    id: "9e9ec31d-ac29-43ba-ae0a-c63bda955a54",
    phone: "+84999900000",
    email: "user@auth.local",
    role: "user",
    status: "active",
    createdAt: "2026-02-12T10:30:00.000Z"
  }
];

export const mockLoginEventsByUser: Record<string, MockLoginEvent[]> = {
  "9e9ec31d-ac29-43ba-ae0a-c63bda955a54": [
    {
      id: "2f2bc8f1-395f-41ad-b451-b38758cc4ea4",
      eventType: "LOGIN_SUCCESS",
      failureReason: null,
      ip: "192.168.1.9",
      userAgent: "iOS Safari",
      deviceId: "ios-15-pro-max",
      occurredAt: "2026-02-15T07:13:21.000Z"
    },
    {
      id: "d6c17e5f-a5f4-47cd-b0d5-31b0ca97f058",
      eventType: "OTP_REQUESTED",
      failureReason: null,
      ip: "192.168.1.9",
      userAgent: "iOS Safari",
      deviceId: "ios-15-pro-max",
      occurredAt: "2026-02-15T07:12:30.000Z"
    }
  ]
};
