import type { IconType } from "react-icons";

export interface Employee {
  name: string;
  residentIdNumber: string;
  idVersion: string;
  nationality: string;
  birthCity: string;
  birthCountry: string;
  dateOfBirth: string;
  maritalStatus: string;
  sponsorshipTransfers: number;
  religion: string;
  occupation: string;
  employer: string;
  employerIdNumber: string;
  issuePlace: string;
  workPermit: string;
  residentIdIssueDate: string;
  residentIdExpiry: string;
  sponsorName: string;
  sponsorIdNumber: string;
  avatarUrl: string;
}

export interface Passport {
  amountDeposit: string;
  passportNumber: string;
  type: string;
  issuingDate: string;
  expiryDate: string;
  issuingCity: string;
  status: string;
}

export interface HajjDetails {
  status: 'eligible' | 'not_eligible';
  lastHajjYear: string;
}

export interface ServiceItem {
  id: string;
  label: string;
  icon: IconType;
}
