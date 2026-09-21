import type {
  Employee,
  Passport,
  HajjDetails,
  ServiceItem,
} from '../types/employee';

import avatarUrl from '../assets/avatar.png';

import {
  FaBaby,
  FaIdCard,
  FaFingerprint,
  FaCamera,
  FaCar,
  FaPassport,
  FaClockRotateLeft,
  FaBox,
  FaMapLocationDot,
  FaShieldHalved,
  FaHandHoldingHeart,
  FaLeaf,
  FaPowerOff,
  FaFileCircleCheck,
  FaFileCircleXmark,
  FaMoneyBillTransfer,
  FaIdBadge,
} from 'react-icons/fa6';
import { TbMapPinQuestion } from 'react-icons/tb';

// Demo data only — replace with GET /api/me once the backend is wired up.

export const demoEmployee: Employee = {
  name: 'JAHAMMED SHEK',
  residentIdNumber: '2456789012',
  idVersion: '3',
  nationality: 'Bangladeshi',
  birthCity: '-',
  birthCountry: 'Bangladesh',
  dateOfBirth: '15/06/1995',
  maritalStatus: 'SINGLE',
  sponsorshipTransfers: 1,
  religion: 'Islam',
  occupation: 'General Worker',
  employer: 'Demo Company',
  employerIdNumber: '7011223344',
  issuePlace: 'N/A',
  workPermit: 'Active',
  residentIdIssueDate: '20/08/2022',
  residentIdExpiry: '19/08/2027',
  sponsorName: 'N/A',
  sponsorIdNumber: '7011223344',
  avatarUrl,
};

export const demoPassport: Passport = {
  amountDeposit: 'SAR 0.00',
  passportNumber: 'EK0987654',
  type: 'Normal',
  issuingDate: '02/03/2021',
  expiryDate: '01/03/2031',
  issuingCity: '113',
  status: '-',
};

export const demoHajjDetails: HajjDetails = {
  status: 'eligible',
  lastHajjYear: '-',
};

export const myServices: ServiceItem[] = [
  {
    id: 'register-newborn',
    label: 'Register Newborn',
    icon: FaBaby,
  },
  {
    id: 'renew-license',
    label: 'Renew Driving License',
    icon: FaIdCard,
  },
  {
    id: 'renew-resident-id',
    label: 'Renew Resident ID',
    icon: FaIdBadge,
  },
  {
    id: 'authentication',
    label: 'Authentication Services',
    icon: FaFingerprint,
  },
  {
    id: 'update-photo',
    label: 'Update Resident Photo',
    icon: FaCamera,
  },
  {
    id: 'report-minor-accident',
    label: 'Report Minor Accident',
    icon: FaCar,
  },
  {
    id: 'passport-renewal',
    label: 'Update Passport Information',
    icon: FaPassport,
  },
];

export const otherServices: ServiceItem[] = [
  {
    id: 'manage-appointments',
    label: 'Manage Appointments',
    icon: FaClockRotateLeft,
  },
  {
    id: 'document-delivery',
    label: 'Document Delivery',
    icon: FaBox,
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: FaMapLocationDot,
  },
  {
    id: 'manage-authorizations',
    label: 'Manage Authorizations',
    icon: FaShieldHalved,
  },
  {
    id: 'donate-furijat',
    label: 'Donate with Furijat',
    icon: FaHandHoldingHeart,
  },
  {
    id: 'donate-ehsan',
    label: 'Donate with Ehsan',
    icon: FaLeaf,
  },
  {
    id: 'visit-visa',
    label: 'Manage Visit Visa',
    icon: FaPassport,
  },
  {
    id: 'service-activation',
    label: 'Service Activation Site',
    icon: FaPowerOff,
  },
  {
    id: 'qabul-request',
    label: 'Manage Qabul Request',
    icon: FaFileCircleCheck,
  },
  {
    id: 'birth-certificate',
    label: 'Birth Certificates Services',
    icon: FaBaby,
  },
  {
    id: 'death-certification',
    label: 'Death Certification Services',
    icon: FaFileCircleXmark,
  },
  {
    id: 'goverment-payments',
    label: 'Goverment Payments',
    icon: FaMoneyBillTransfer,
  },
  {
    id: 'resident-id',
    label: 'Resident Id Request',
    icon: FaIdCard,
  },
  {
    id: 'resident-id',
    label: 'Border Number Inquiry',
    icon: TbMapPinQuestion,
  },
];