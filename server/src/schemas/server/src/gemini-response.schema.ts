export const geminiCrmResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      _row_id: {
        type: "integer",
      },
      created_at: {
        type: "string",
      },
      name: {
        type: "string",
      },
      email: {
        type: "string",
      },
      country_code: {
        type: "string",
      },
      mobile_without_country_code: {
        type: "string",
      },
      company: {
        type: "string",
      },
      city: {
        type: "string",
      },
      state: {
        type: "string",
      },
      country: {
        type: "string",
      },
      lead_owner: {
        type: "string",
      },
      crm_status: {
        type: "string",
        enum: [
          "GOOD_LEAD_FOLLOW_UP",
          "DID_NOT_CONNECT",
          "BAD_LEAD",
          "SALE_DONE",
          "",
        ],
      },
      crm_note: {
        type: "string",
      },
      data_source: {
        type: "string",
        enum: [
          "leads_on_demand",
          "meridian_tower",
          "eden_park",
          "varah_swamy",
          "sarjapur_plots",
          "",
        ],
      },
      possession_time: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
    required: [
      "_row_id",
      "created_at",
      "name",
      "email",
      "country_code",
      "mobile_without_country_code",
      "company",
      "city",
      "state",
      "country",
      "lead_owner",
      "crm_status",
      "crm_note",
      "data_source",
      "possession_time",
      "description",
    ],
  },
} as const;