/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LabTest {
  id: string;
  name: string;
  category: "Blood" | "Kidney" | "Liver" | "Cardiac" | "Metabolic" | "Thyroid" | "General";
  price: number;
  code: string;
  description: string;
  sampleType: string;
  fastingRequired: boolean;
  eta: string;
}

export interface Booking {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  testsSelected: string[];
  status: "Pending" | "Confirmed" | "Sample Collected" | "Completed" | "Cancelled";
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
