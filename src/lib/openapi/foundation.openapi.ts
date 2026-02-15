const errorEnvelopeSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message", "requestId", "retryable"],
      properties: {
        code: {
          type: "string",
          enum: [
            "AUTH_REQUIRED",
            "FORBIDDEN",
            "NOT_FOUND",
            "VALIDATION_ERROR",
            "RATE_LIMITED",
            "OTP_INVALID",
            "OTP_EXPIRED",
            "OTP_RATE_LIMITED",
            "INTERNAL_ERROR"
          ]
        },
        message: {
          type: "string"
        },
        requestId: {
          type: "string",
          format: "uuid"
        },
        retryable: {
          type: "boolean"
        }
      }
    }
  }
};

const paginationSchema = {
  type: "object",
  required: ["nextCursor", "hasMore", "limit"],
  properties: {
    nextCursor: {
      type: "string",
      nullable: true
    },
    hasMore: {
      type: "boolean"
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: 100
    }
  }
};

export const foundationOpenApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Auth Platform Foundation API",
    version: "0.1.0",
    description:
      "EPIC-001 foundation contract. Handlers are skeleton-only in this stage and do not contain domain service logic."
  },
  servers: [
    {
      url: "/"
    }
  ],
  tags: [
    { name: "auth", description: "Public OTP authentication endpoints" },
    { name: "admin", description: "Admin-only management endpoints" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    },
    schemas: {
      ErrorEnvelope: errorEnvelopeSchema,
      Pagination: paginationSchema,
      OtpRequestBody: {
        type: "object",
        required: ["phone"],
        properties: {
          phone: {
            type: "string",
            example: "+84987654321"
          }
        }
      },
      OtpVerifyBody: {
        type: "object",
        required: ["phone", "code"],
        properties: {
          phone: {
            type: "string"
          },
          code: {
            type: "string",
            minLength: 4,
            maxLength: 8
          }
        }
      },
      OtpRequestResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["status", "ttlSeconds", "resendCooldownSeconds"],
            properties: {
              status: { type: "string", enum: ["PENDING"] },
              ttlSeconds: { type: "integer" },
              resendCooldownSeconds: { type: "integer" }
            }
          }
        }
      },
      OtpVerifyResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["status"],
            properties: {
              status: { type: "string", enum: ["VERIFIED"] },
              session: {
                type: "object",
                nullable: true,
                description: "Foundation skeleton returns null until auth service is implemented."
              }
            }
          }
        }
      },
      AdminUser: {
        type: "object",
        required: ["id", "phone", "email", "role", "status", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          phone: { type: "string", nullable: true },
          email: { type: "string", nullable: true },
          role: { type: "string", enum: ["admin", "user"] },
          status: { type: "string", enum: ["active", "disabled", "deleted"] },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      AdminLoginEvent: {
        type: "object",
        required: ["id", "eventType", "occurredAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          eventType: {
            type: "string",
            enum: ["LOGIN_SUCCESS", "LOGIN_FAILED", "OTP_REQUESTED"]
          },
          failureReason: { type: "string", nullable: true },
          ip: { type: "string", nullable: true },
          userAgent: { type: "string", nullable: true },
          deviceId: { type: "string", nullable: true },
          occurredAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    "/api/auth/otp/request": {
      post: {
        tags: ["auth"],
        summary: "Request OTP",
        operationId: "requestOtp",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/OtpRequestBody"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OTP request accepted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OtpRequestResponse"
                }
              }
            }
          },
          "429": {
            description: "Rate-limited OTP request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/otp/verify": {
      post: {
        tags: ["auth"],
        summary: "Verify OTP",
        operationId: "verifyOtp",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/OtpVerifyBody"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OTP verified",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OtpVerifyResponse"
                }
              }
            }
          },
          "400": {
            description: "Invalid OTP",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          },
          "429": {
            description: "Rate-limited OTP verify",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users": {
      get: {
        tags: ["admin"],
        summary: "List users",
        operationId: "adminListUsers",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20, maximum: 100 }
          },
          {
            name: "cursor",
            in: "query",
            schema: { type: "string", nullable: true }
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["created_at_desc", "created_at_asc"] }
          }
        ],
        responses: {
          "200": {
            description: "Paginated users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "page"],
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/AdminUser"
                      }
                    },
                    page: {
                      $ref: "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Auth required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users/{id}/disable": {
      post: {
        tags: ["admin"],
        summary: "Disable user",
        operationId: "adminDisableUser",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: {
          "200": {
            description: "User disabled",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["id", "status"],
                      properties: {
                        id: { type: "string", format: "uuid" },
                        status: { type: "string", enum: ["disabled"] }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Auth required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users/{id}/delete": {
      delete: {
        tags: ["admin"],
        summary: "Delete user",
        operationId: "adminDeleteUser",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: {
          "200": {
            description: "User deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["id", "status"],
                      properties: {
                        id: { type: "string", format: "uuid" },
                        status: { type: "string", enum: ["deleted"] }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Auth required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users/{id}/login-events": {
      get: {
        tags: ["admin"],
        summary: "List user login events",
        operationId: "adminListUserLoginEvents",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" }
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20, maximum: 100 }
          },
          {
            name: "cursor",
            in: "query",
            schema: { type: "string", nullable: true }
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["occurred_at_desc", "occurred_at_asc"], default: "occurred_at_desc" }
          }
        ],
        responses: {
          "200": {
            description: "Paginated login events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data", "page"],
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/AdminLoginEvent"
                      }
                    },
                    page: {
                      $ref: "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Auth required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorEnvelope"
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
