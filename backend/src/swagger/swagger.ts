// src/swagger/swagger.ts
// นี่คือ OpenAPI spec ของ EasyMake-MFU
// ถ้าต้องการแก้/เพิ่ม endpoint ให้แก้ไฟล์นี้

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "EasyMake-MFU API",
    version: "1.0.0",
    description:
      "API for EasyMake-MFU (Express + MongoDB). Roles: user, club-leader, super-admin."
  },
  servers: [
    {
      url: "http://localhost:8081/api",
      description: "Local Dev"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "admin@mfu.ac.th" },
          password: { type: "string", example: "admin123" },
          role: {
            type: "string",
            enum: ["super-admin", "club-leader", "user"]
          },
          citizenId: {
            type: "string",
            example: "1103701000001",
            description: "Required for super-admin / club-leader"
          },
          studentId: {
            type: "string",
            example: "6621100001",
            description: "Required for user role"
          },
          fullName: {
            type: "string",
            example: "Kiattisak Deeprasert"
          }
        },
        required: ["email", "password", "role", "fullName"]
      },

      RegisterResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Registration successful" },
          user: {
            type: "object",
            properties: {
              _id: { type: "string", example: "671ac210fb2c9c00123abc02" },
              email: { type: "string", example: "admin@mfu.ac.th" },
              role: { type: "string", example: "super-admin" },
              fullName: {
                type: "string",
                example: "Student Affairs Admin"
              }
            }
          }
        }
      },

      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "admin@mfu.ac.th" },
          password: { type: "string", example: "admin123" }
        },
        required: ["email", "password"]
      },

      LoginResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          },
          user: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "671ac210fb2c9c00123abc02"
              },
              email: { type: "string", example: "admin@mfu.ac.th" },
              role: { type: "string", example: "super-admin" },
              fullName: {
                type: "string",
                example: "Student Affairs Admin"
              }
            }
          }
        }
      },

      MeResponse: {
        type: "object",
        properties: {
          _id: { type: "string", example: "671ac210fb2c9c00123abc02" },
          email: { type: "string", example: "admin@mfu.ac.th" },
          role: { type: "string", example: "super-admin" },
          fullName: {
            type: "string",
            example: "Student Affairs Admin"
          },
          status: { type: "string", example: "active" }
        }
      },

      CreateClubRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "MFU Dance Club" },
          description: {
            type: "string",
            "example": "We do K-pop cover practice every Fri 6PM."
          },
          category: { type: "string", example: "performance" },
          status: { type: "string", example: "active" }
        },
        required: ["name", "description", "category", "status"]
      },

      ClubResponse: {
        type: "object",
        properties: {
          _id: { type: "string", example: "671aa12efb2c9c001234ef01" },
          name: { type: "string", example: "MFU Dance Club" },
          description: {
            type: "string",
            example: "We do K-pop cover practice every Fri 6PM."
          },
          category: { type: "string", example: "performance" },
          status: { type: "string", example: "active" },
          createdAt: {
            type: "string",
            example: "2025-10-27T07:30:00.123Z"
          }
        }
      },

      ClubListItem: {
        type: "object",
        properties: {
          _id: { type: "string", example: "671aa12efb2c9c001234ef01" },
          name: { type: "string", example: "MFU Dance Club" },
          category: { type: "string", example: "performance" },
          status: { type: "string", example: "active" }
        }
      },

      CreatePostRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Recruitment Week is Open!"
          },
          content: {
            type: "string",
            "example":
              "Walk-in audition this Friday 18:00 at Studio B."
          },
          published: { type: "boolean", example: true }
        },
        required: ["title", "content"]
      },

      PostResponse: {
        type: "object",
        properties: {
          _id: { type: "string", example: "671aa4c5fb2c9c001234fabc" },
          clubId: {
            type: "string",
            example: "671aa12efb2c9c001234ef01"
          },
          title: {
            type: "string",
            example: "Recruitment Week is Open!"
          },
          content: {
            type: "string",
            "example":
              "Walk-in audition this Friday 18:00 at Studio B."
          },
          published: { type: "boolean", example: true },
          updatedAt: {
            type: "string",
            example: "2025-10-27T07:45:12.000Z"
          }
        }
      },

      JoinClubRequest: {
        type: "object",
        properties: {
          studentId: { type: "string", example: "6621100001" },
          reason: {
            type: "string",
            "example": "I love dance and want to join activities."
          }
        },
        required: ["studentId", "reason"]
      },

      JoinClubResponse: {
        type: "object",
        properties: {
          _id: { type: "string", example: "671ab201fb2c9c001234bbbb" },
          clubId: {
            type: "string",
            example: "671aa12efb2c9c001234ef01"
          },
          userId: {
            type: "string",
            example: "671a9a9dfb2c9c001234abcd"
          },
          status: { type: "string", example: "pending" },
          createdAt: {
            type: "string",
            example: "2025-10-27T08:15:00.000Z"
          }
        }
      },

      PendingMemberItem: {
        type: "object",
        properties: {
          requestId: {
            type: "string",
            example: "671ab201fb2c9c001234bbbb"
          },
          userFullName: {
            type: "string",
            example: "Kiattisak Deeprasert"
          },
          studentId: { type: "string", example: "6621100001" },
          status: { type: "string", example: "pending" }
        }
      },

      ApproveMemberRequest: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["approve", "reject"],
            example: "approve"
          }
        },
        required: ["action"]
      },

      ApproveMemberResponse: {
        type: "object",
        properties: {
          requestId: {
            type: "string",
            example: "671ab201fb2c9c001234bbbb"
          },
          status: { type: "string", example: "approved" }
        }
      },

      DevSendEmailRequest: {
        type: "object",
        properties: {
          to: { type: "string", example: "leader@mfu.ac.th" },
          subject: {
            type: "string",
            example: "EasyMake-MFU Notification"
          },
          text: {
            type: "string",
            "example":
              "Your club has a new join request."
          }
        },
        required: ["to", "subject", "text"]
      },

      DevSendEmailResponse: {
        type: "object",
        properties: {
          messageId: {
            type: "string",
            example: "<b658f8...@example.com>"
          },
          previewUrl: {
            type: "string",
            "example":
              "https://ethereal.email/message/YOUR_MESSAGE_TOKEN"
          }
        }
      },

      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Forbidden" }
        }
      }
    }
  },

  paths: {
    "/auth/register": {
      post: {
        summary:
          "Register new account (super-admin, club-leader, or user)",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse"
                }
              }
            }
          },
          "409": {
            description: "Email already in use",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "400": {
            description:
              "Bad request / Missing required fields (e.g. citizenId)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },

    "/auth/login": {
      post: {
        summary: "Login and receive JWT",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/users/me": {
      get: {
        summary: "Get my profile (requires JWT)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current logged-in user info",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MeResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/clubs": {
      post: {
        summary: "Create a new club (super-admin only)",
        tags: ["Clubs"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateClubRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Club created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClubResponse" }
              }
            }
          },
          "403": {
            description: "Forbidden (not super-admin)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },

      get: {
        summary: "List clubs (public)",
        tags: ["Clubs"],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", example: "active" }
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string", example: "performance" }
          }
        ],
        responses: {
          "200": {
            description: "List of clubs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/ClubListItem"
                  }
                }
              }
            }
          }
        }
      }
    },

    "/clubs/{clubId}/posts": {
      post: {
        summary:
          "Create a post in a club (club-leader of that club OR super-admin)",
        tags: ["Club Posts"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "clubId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671aa12efb2c9c001234ef01"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreatePostRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Post created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostResponse" }
              }
            }
          },
          "403": {
            description:
              "Forbidden (not allowed to post here)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },

      get: {
        summary:
          "Get club posts (public, can filter published=true)",
        tags: ["Club Posts"],
        parameters: [
          {
            name: "clubId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671aa12efb2c9c001234ef01"
            }
          },
          {
            name: "published",
            in: "query",
            schema: { type: "boolean", example: true }
          }
        ],
        responses: {
          "200": {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/PostResponse"
                  }
                }
              }
            }
          }
        }
      }
    },

    "/clubs/{clubId}/join": {
      post: {
        summary: "Request to join club (user role)",
        tags: ["Membership"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "clubId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671aa12efb2c9c001234ef01"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JoinClubRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description:
              "Join request created, status pending",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JoinClubResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized (no token/invalid)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/clubs/{clubId}/members": {
      get: {
        summary:
          "List pending members (club-leader of this club only)",
        tags: ["Membership"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "clubId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671aa12efb2c9c001234ef01"
            }
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string", example: "pending" }
          }
        ],
        responses: {
          "200": {
            "description": "Pending members list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/PendingMemberItem"
                  }
                }
              }
            }
          },
          "403": {
            description:
              "Forbidden (not leader of this club)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/clubs/{clubId}/members/{requestId}": {
      patch: {
        summary:
          "Approve or reject member (club-leader of this club)",
        tags: ["Membership"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "clubId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671aa12efb2c9c001234ef01"
            }
          },
          {
            name: "requestId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "671ab201fb2c9c001234bbbb"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApproveMemberRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Member request updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApproveMemberResponse"
                }
              }
            }
          },
          "403": {
            description: "Forbidden (not club-leader)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/dev/send-test-email": {
      post: {
        summary:
          "DEV ONLY: Send test email via Ethereal (super-admin only)",
        tags: ["Dev"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DevSendEmailRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Email simulated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DevSendEmailResponse"
                }
              }
            }
          },
          "403": {
            description: "Forbidden (not super-admin)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerDocument;