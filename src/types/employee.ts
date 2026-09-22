import type { IconType } from 'react-icons';

/*
|--------------------------------------------------------------------------
| Employee
|--------------------------------------------------------------------------
|
| Contains personal / employment information for one employee.
|
*/

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

  // This employee's profile/avatar image
  avatarUrl: string;
}


/*
|--------------------------------------------------------------------------
| Passport
|--------------------------------------------------------------------------
*/

export interface Passport {
  amountDeposit: string;

  passportNumber: string;

  type: string;

  issuingDate: string;

  expiryDate: string;

  issuingCity: string;

  status: string;
}


/*
|--------------------------------------------------------------------------
| Hajj Details
|--------------------------------------------------------------------------
*/

export interface HajjDetails {
  status: 'eligible' | 'not_eligible';

  lastHajjYear: string;
}


/*
|--------------------------------------------------------------------------
| Health Insurance
|--------------------------------------------------------------------------
|
| Optional because not every employee may have this information.
|
*/

export interface HealthInsurance {
  issuingDate: string;

  expiryDate: string;
}


/*
|--------------------------------------------------------------------------
| QR Data
|--------------------------------------------------------------------------
|
| Keep the actual QR information separate from the employee profile.
|
| Later, when you have the real QR requirements, you can add/remove
| fields here without changing Employee.
|
*/

export interface EmployeeQRData {
  name: string;

  residentIdNumber: string;

  nationality: string;

  dateOfBirth: string;

  sponsorName: string;

  sponsorIdNumber: string;
}


/*
|--------------------------------------------------------------------------
| Service Item
|--------------------------------------------------------------------------
*/

export interface ServiceItem {
  id: string;

  label: string;

  icon: IconType;
}