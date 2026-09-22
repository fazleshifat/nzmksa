import type { ServiceItem } from '../types/employee';

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

/*
|--------------------------------------------------------------------------
| My Services
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Other Services
|--------------------------------------------------------------------------
*/

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
    id: 'border-number',
    label: 'Border Number Inquiry',
    icon: TbMapPinQuestion,
  },
];