import type {
  Employee,
  Passport,
  HajjDetails,
  HealthInsurance,
  EmployeeQRData,
  ServiceItem,
} from '../types/employee';

import avatarOne from '../assets/avatar-2432859995.png';
import iqamaOne from '../assets/iqama-2432859995.png';

import avatarTwo from '../assets/avatar-2600483065.png';
import iqamaTwo from '../assets/iqama-2600483065.jpeg';

import avatarThree from '../assets/avatar-2601270883.png';
import iqamaThree from '../assets/iqama-2601270883.jpeg';

import avatarFour from '../assets/avatar-2536788355.png';
import iqamaFour from '../assets/iqama-2536788355.jpeg';

import avatarFive from '../assets/avatar-2578742500.png';
import iqamaFive from '../assets/iqama-2578742500.jpeg';

import avatarSix from '../assets/avatar-2563329362.png';
import iqamaSix from '../assets/iqama-2563329362.jpeg';

import avatarSeven from '../assets/avatar-2530696026.png';
import iqamaSeven from '../assets/iqama-2530696026.jpeg';

import avatarEight from '../assets/avatar-2600976894.png';
import iqamaEight from '../assets/iqama-2600976894.jpeg';

import avatarNine from '../assets/avatar-2600976498.png';
import iqamaNine from '../assets/iqama-2600976498.jpeg';

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
| Demo Employee Account
|--------------------------------------------------------------------------
|
| One object = one complete employee account.
|
| Resident ID
|      ↓
| Matching account
|      ↓
| employee
| passport
| hajjDetails
| healthInsurance
| qrData
| iqamaImage
|
|--------------------------------------------------------------------------
*/

export interface DemoEmployeeAccount {
  password: string;

  employee: Employee;

  passport: Passport;

  hajjDetails: HajjDetails;

  healthInsurance?: HealthInsurance;

  qrData?: EmployeeQRData;

  // This employee's Iqama / Resident ID image
  iqamaImage: string;
}


/*
|--------------------------------------------------------------------------
| Demo Employee Accounts
|--------------------------------------------------------------------------
|
| Current accounts:
|
| 1. JAHAMMED SHEK
|    Resident ID: 2432859995
|
| 2. MD BASIR SIKDER
|    Resident ID: 2600483065
|
| 3. RAJAUL ISLAM
|    Resident ID: 2601270883
|
| Password:
| Aa123456
|
|--------------------------------------------------------------------------
*/

export const demoEmployeeAccounts: DemoEmployeeAccount[] = [

  /*
  |--------------------------------------------------------------------------
  | 1. JAHAMMED SHEK
  |--------------------------------------------------------------------------
  */

  {
    password: 'Aa123456',

    employee: {
      name: 'JAHAMMED SHEK',

      residentIdNumber: '2432859995',

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

      avatarUrl: avatarOne,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'EK0987654',

      type: 'Normal',

      issuingDate: '02/03/2021',

      expiryDate: '01/03/2031',

      issuingCity: '113',

      status: '-',
    },

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },

    qrData: {
      name: 'JAHAMMED SHEK',

      residentIdNumber: '2432859995',

      nationality: 'Bangladeshi',

      dateOfBirth: '15/06/1995',

      sponsorName: 'N/A',

      sponsorIdNumber: '7011223344',
    },

    iqamaImage: iqamaOne,
  },


  /*
  |--------------------------------------------------------------------------
  | 2. MD BASIR SIKDER
  |--------------------------------------------------------------------------
  */

  {
    password: 'Aa123456',

    employee: {
      name: 'MD BASIR SIKDER',

      residentIdNumber: '2600483065',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '01/01/1985',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '24/03/2027',

      residentIdExpiry: '04/06/2027',

      sponsorName: 'نقليات عايد جزاء الحربي',

      sponsorIdNumber: '7025924718',

      avatarUrl: avatarTwo,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A11359211',

      type: 'Normal',

      issuingDate: '23/07/2023',

      expiryDate: '22/07/2033',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    healthInsurance: {
      issuingDate: '18/12/2025',

      expiryDate: '22/11/2026',
    },

    qrData: {
      name: 'MD BASIR SIKDER',

      residentIdNumber: '2600483065',

      nationality: 'Bangladeshi',

      dateOfBirth: '01/01/1985',

      sponsorName: 'نقليات عايد جزاء الحربي',

      sponsorIdNumber: '7025924718',
    },

    iqamaImage: iqamaTwo,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },


  /*
  |--------------------------------------------------------------------------
  | 3. RAJAUL ISLAM
  |--------------------------------------------------------------------------
  */

  {
    password: 'Aa123456',

    employee: {
      name: 'RAJAUL ISLAM',

      residentIdNumber: '2601270883',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '05/03/1989',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '08/04/2025',

      residentIdExpiry: '04/06/2027',

      sponsorName: 'مؤسسة مويضي عزيز جعيثن الحربي للمقاولات العامة',

      sponsorIdNumber: '7043778931',

      avatarUrl: avatarThree,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A08446736',

      type: 'Normal',

      issuingDate: '11/12/2023',

      expiryDate: '10/12/2033',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    healthInsurance: {
      issuingDate: '21/07/2026',

      expiryDate: '20/07/2027',
    },

    qrData: {
      name: 'RAJAUL ISLAM',

      residentIdNumber: '2601270883',

      nationality: 'Bangladeshi',

      dateOfBirth: '05/03/1989',

      sponsorName: 'مؤسسة مويضي عزيز جعيثن الحربي للمقاولات العامة',

      sponsorIdNumber: '7043778931',
    },

    iqamaImage: iqamaThree,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },

  /*
|--------------------------------------------------------------------------
| 4. MD TAREQ AZIZ
|--------------------------------------------------------------------------
*/

  {
    password: 'Aa123456',

    employee: {
      name: 'MD TAREQ AZIZ',

      residentIdNumber: '2536788355',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '17/10/1984',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '08/01/2023',

      residentIdExpiry: '12/02/2027',

      sponsorName: 'تقلبات سعد الناصر',

      sponsorIdNumber: '7028948458',

      avatarUrl: avatarFour,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A04021766',

      type: 'Normal',

      issuingDate: '24/07/2022',

      expiryDate: '23/07/2032',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    /*
    |--------------------------------------------------------------------------
    | TAREQ HEALTH INSURANCE
    |--------------------------------------------------------------------------
    */

    healthInsurance: {
      issuingDate: '30/01/2026',

      expiryDate: '30/01/2027',
    },

    /*
    |--------------------------------------------------------------------------
    | TAREQ QR
    |--------------------------------------------------------------------------
    */

    qrData: {
      name: 'MD TAREQ AZIZ',

      residentIdNumber: '2536788355',

      nationality: 'Bangladeshi',

      dateOfBirth: '17/10/1984',

      sponsorName: 'تقلبات سعد الناصر',

      sponsorIdNumber: '7028948458',
    },

    /*
    |--------------------------------------------------------------------------
    | TAREQ IQAMA IMAGE
    |--------------------------------------------------------------------------
    */

    iqamaImage: iqamaFour,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },

  /*
|--------------------------------------------------------------------------
| 5. MD SHEIKH FARID
|--------------------------------------------------------------------------
*/

  {
    password: 'Aa123456',

    employee: {
      name: 'MD SHEIKH FARID',

      residentIdNumber: '2578742500',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '28/11/2002',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: 'ব্যবসা',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '15/07/2024',

      residentIdExpiry: '21/02/2027',

      sponsorName: 'غيداء الحربي للنقليات',

      sponsorIdNumber: '7031826089',

      avatarUrl: avatarFive,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A07429518',

      type: 'Normal',

      issuingDate: '26/03/2023',

      expiryDate: '25/03/2033',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    /*
    |--------------------------------------------------------------------------
    | FARID HEALTH INSURANCE
    |--------------------------------------------------------------------------
    */

    healthInsurance: {
      issuingDate: '07/02/2026',

      expiryDate: '06/02/2027',
    },

    /*
    |--------------------------------------------------------------------------
    | FARID QR
    |--------------------------------------------------------------------------
    */

    qrData: {
      name: 'MD SHEIKH FARID',

      residentIdNumber: '2578742500',

      nationality: 'Bangladeshi',

      dateOfBirth: '28/11/2002',

      sponsorName: 'غيداء الحربي للنقليات',

      sponsorIdNumber: '7031826089',
    },

    /*
    |--------------------------------------------------------------------------
    | FARID IQAMA IMAGE
    |--------------------------------------------------------------------------
    */

    iqamaImage: iqamaFive,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },

  /*
|--------------------------------------------------------------------------
| 6. ABDUR RAHIM
|--------------------------------------------------------------------------
*/

  {
    password: 'Aa123456',

    employee: {
      name: 'ABDUR RAHIM',

      residentIdNumber: '2563329362',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '07/07/1986',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '31/12/2023',

      residentIdExpiry: '12/01/2027',

      sponsorName: 'مؤسسة عامر على مناور المطيري للمقاولات العامة',

      sponsorIdNumber: '7043009708',

      avatarUrl: avatarSix,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A11302679',

      type: 'Normal',

      issuingDate: '19/07/2023',

      expiryDate: '18/07/2033',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    /*
    |--------------------------------------------------------------------------
    | ABDUR RAHIM HEALTH INSURANCE
    |--------------------------------------------------------------------------
    */

    healthInsurance: {
      issuingDate: '26/01/2026',

      expiryDate: '25/01/2027',
    },

    /*
    |--------------------------------------------------------------------------
    | ABDUR RAHIM QR
    |--------------------------------------------------------------------------
    */

    qrData: {
      name: 'ABDUR RAHIM',

      residentIdNumber: '2563329362',

      nationality: 'Bangladeshi',

      dateOfBirth: '07/07/1986',

      sponsorName: 'مؤسسة عامر على مناور المطيري للمقاولات العامة',

      sponsorIdNumber: '7043009708',
    },

    /*
    |--------------------------------------------------------------------------
    | ABDUR RAHIM IQAMA IMAGE
    |--------------------------------------------------------------------------
    */

    iqamaImage: iqamaSix,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },


  /*
  |--------------------------------------------------------------------------
  | 7. MD SAIFUL ISLAM
  |--------------------------------------------------------------------------
  */

  {
    password: 'Aa123456',

    employee: {
      name: 'MD SAIFUL ISLAM',

      residentIdNumber: '2530696026',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '09/10/1993',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '31/12/2022',

      residentIdExpiry: '01/02/2027',

      sponsorName: 'شركة مبارك على آل منصور للنقل والتخزين',

      sponsorIdNumber: '7039028548',

      avatarUrl: avatarSeven,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A03073796',

      type: 'Normal',

      issuingDate: '25/01/2022',

      expiryDate: '24/01/2032',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    /*
    |--------------------------------------------------------------------------
    | MD SAIFUL ISLAM HEALTH INSURANCE
    |--------------------------------------------------------------------------
    */

    healthInsurance: {
      issuingDate: '23/05/2026',

      expiryDate: '22/05/2027',
    },

    /*
    |--------------------------------------------------------------------------
    | MD SAIFUL ISLAM QR
    |--------------------------------------------------------------------------
    */

    qrData: {
      name: 'MD SAIFUL ISLAM',

      residentIdNumber: '2530696026',

      nationality: 'Bangladeshi',

      dateOfBirth: '09/10/1993',

      sponsorName: 'شركة مبارك على آل منصور للنقل والتخزين',

      sponsorIdNumber: '7039028548',
    },

    /*
    |--------------------------------------------------------------------------
    | MD SAIFUL ISLAM IQAMA IMAGE
    |--------------------------------------------------------------------------
    */

    iqamaImage: iqamaSeven,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },

  /*
  |--------------------------------------------------------------------------
  | 8. MD ELANUR MATOBBER
  |--------------------------------------------------------------------------
  */
  {
    password: 'Aa123456',

    employee: {
      name: 'MD ELANUR MATOBBER',

      residentIdNumber: '2600976894',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '01/01/1988',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '05/04/2025',

      residentIdExpiry: '04/06/2027',

      sponsorName:
        'العمل مؤسسة سعود بن سفاح بن صالح الفيداني للمقاولات العامة.',

      sponsorIdNumber: '7043138887',

      avatarUrl: avatarEight,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A17150918',

      type: 'Normal',

      issuingDate: '04/12/2024',

      expiryDate: '03/12/2034',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    healthInsurance: {
      issuingDate: '01/07/2026',

      expiryDate: '30/06/2027',
    },

    qrData: {
      name: 'MD ELANUR MATOBBER',

      residentIdNumber: '2600976894',

      nationality: 'Bangladeshi',

      dateOfBirth: '01/01/1988',

      sponsorName:
        'العمل مؤسسة سعود بن سفاح بن صالح الفيداني للمقاولات العامة.',

      sponsorIdNumber: '7043138887',
    },

    iqamaImage: iqamaEight,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },

   /*
  |--------------------------------------------------------------------------
  | 9. CHUNNU SHEIKH
  |--------------------------------------------------------------------------
  */

  {
    password: 'Aa123456',

    employee: {
      name: 'CHUNNU SHEIKH',

      residentIdNumber: '2600976498',

      idVersion: 'N/A',

      nationality: 'Bangladeshi',

      birthCity: '-',

      birthCountry: 'Bangladesh',

      dateOfBirth: '10/10/1989',

      maritalStatus: 'SINGLE',

      sponsorshipTransfers: 0,

      religion: 'Islam',

      occupation: '-',

      employer: '-',

      employerIdNumber: '-',

      issuePlace: '-',

      workPermit: '-',

      residentIdIssueDate: '05/04/2025',

      residentIdExpiry: '01/03/2027',

      sponsorName:
        'مؤسسة سعود بن صلاح بن صالح الفيداني للمقاولات العامة',

      sponsorIdNumber: '7043009708',

      avatarUrl: avatarNine,
    },

    passport: {
      amountDeposit: 'SAR 0.00',

      passportNumber: 'A03870440',

      type: 'Normal',

      issuingDate: '10/05/2022',

      expiryDate: '09/05/2027',

      issuingCity: 'Bangladesh',

      status: '-',
    },

    healthInsurance: {
      issuingDate: '01/07/2026',

      expiryDate: '30/06/2027',
    },

    qrData: {
      name: 'CHUNNU SHEIKH',

      residentIdNumber: '2600976498',

      nationality: 'Bangladeshi',

      dateOfBirth: '10/10/1989',

      sponsorName:
        'مؤسسة سعود بن صلاح بن صالح الفيداني للمقاولات العامة',

      sponsorIdNumber: '7043009708',
    },

    iqamaImage: iqamaNine,

    hajjDetails: {
      status: 'eligible',

      lastHajjYear: '-',
    },
  },
];

/*
|--------------------------------------------------------------------------
| Temporary backward compatibility
|--------------------------------------------------------------------------
*/

export const demoEmployee =
  demoEmployeeAccounts[0].employee;

export const demoPassport =
  demoEmployeeAccounts[0].passport;

export const demoHajjDetails =
  demoEmployeeAccounts[0].hajjDetails;


/*
|--------------------------------------------------------------------------
| Services
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