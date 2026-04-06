import { z } from "zod";

/**
 * Validation schema for Contract related operations.
 */

export const CreateContractSchema = z.object({
  // Mandatory fields
  contract_number: z.string({
    required_error: "Contract number is required",
  }),
  status: z.string({
    required_error: "Status is required",
  }),

  // Optional fields (checkboxes or generated)
  client_id: z.string({
    required_error: "Client ID is required",
  }),
  application_id: z.string({
    required_error: "Application ID is required",
  }),
  standards: z.array(z.string()).optional().or(z.string().optional()), // Standards can be checkboxes (array) or single

  // Other optional details
  contract_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  value: z.number().optional(),
  notes: z.string().optional(),
  review_notes: z.string().optional(),
  reviewed_by: z.string().optional(),
  reviewed_at: z.string().optional(),
  sent_at: z.string().optional(),
  signed_at: z.string().optional(),
  contract_status: z.string().optional(),
  pdf_url: z.string().optional(), // Draft contract upload URL
  emailed_at: z.string().optional(),

  // User info from middleware normally, but can be in schema
  created_by: z.string().optional(),
});
export type CreateContract = z.infer<typeof CreateContractSchema>;
