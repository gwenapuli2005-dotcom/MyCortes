export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'date' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  maxLength?: number;
  halfWidth?: boolean;
}

export interface ServiceCategory {
  value: string;
  label: string;
  description: string;
  fields: FormFieldConfig[];
}

const commonNameField: FormFieldConfig = {
  name: 'fullName', label: 'Buong Pangalan / Full Name', type: 'text',
  placeholder: 'Juan A. Dela Cruz', required: true, maxLength: 100,
};

const civilStatusField: FormFieldConfig = {
  name: 'civilStatus', label: 'Katayuang Sibil / Civil Status', type: 'select', required: true,
  options: [
    { value: 'single', label: 'Dalaga/Binata (Single)' },
    { value: 'married', label: 'May Asawa (Married)' },
    { value: 'widowed', label: 'Biyuda/Biyudo (Widowed)' },
    { value: 'separated', label: 'Hiwalay (Separated)' },
  ],
};

const birthdateField: FormFieldConfig = {
  name: 'birthdate', label: 'Petsa ng Kapanganakan / Date of Birth', type: 'date', required: true, halfWidth: true,
};

const ageField: FormFieldConfig = {
  name: 'age', label: 'Edad / Age', type: 'number', placeholder: '25', required: true, halfWidth: true,
};

const sexField: FormFieldConfig = {
  name: 'sex', label: 'Kasarian / Sex', type: 'select', required: true, halfWidth: true,
  options: [
    { value: 'male', label: 'Lalaki (Male)' },
    { value: 'female', label: 'Babae (Female)' },
  ],
};

const contactField: FormFieldConfig = {
  name: 'contactNumber', label: 'Contact Number', type: 'tel',
  placeholder: '09XX XXX XXXX', required: true, maxLength: 15, halfWidth: true,
};

const addressField: FormFieldConfig = {
  name: 'address', label: 'Tirahan / Complete Address', type: 'text',
  placeholder: 'Purok/Sitio, Barangay, Cortes, Surigao del Sur', required: true, maxLength: 200,
};

const purposeField: FormFieldConfig = {
  name: 'purpose', label: 'Layunin / Purpose', type: 'select', required: true,
  options: [
    { value: 'employment', label: 'Trabaho / Employment' },
    { value: 'business', label: 'Negosyo / Business' },
    { value: 'school', label: 'Paaralan / School Requirement' },
    { value: 'travel', label: 'Biyahe / Travel' },
    { value: 'legal', label: 'Legal na Transaksyon / Legal Transaction' },
    { value: 'loan', label: 'Pautang / Loan Application' },
    { value: 'government', label: 'Government Transaction' },
    { value: 'other', label: 'Iba pa / Other' },
  ],
};

const occupationField: FormFieldConfig = {
  name: 'occupation', label: 'Trabaho / Occupation', type: 'text',
  placeholder: 'e.g., Magsasaka, Mangingisda, OFW, Estudyante', required: true, halfWidth: true,
};

const nationalityField: FormFieldConfig = {
  name: 'nationality', label: 'Nasyonalidad / Nationality', type: 'text',
  placeholder: 'Filipino', required: false, halfWidth: true,
};

export const categories: ServiceCategory[] = [
  {
    value: 'barangay_clearance',
    label: 'Barangay Clearance',
    description: 'Para sa trabaho, negosyo, at iba pa',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      { ...occupationField }, { ...contactField },
      { ...nationalityField },
      purposeField,
    ],
  },
  {
    value: 'community_tax',
    label: 'Cedula (Community Tax Certificate)',
    description: 'Individual o corporate na sedula',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      occupationField, contactField,
      { name: 'annualIncome', label: 'Taunang Kita / Annual Income', type: 'text', placeholder: '₱0.00', required: true, halfWidth: true },
      { name: 'tinNumber', label: 'TIN Number (kung meron)', type: 'text', placeholder: 'XXX-XXX-XXX-XXX', required: false, halfWidth: true },
      purposeField,
    ],
  },
  {
    value: 'birth_certificate',
    label: 'Birth Certificate',
    description: 'Kopya ng sertipiko ng kapanganakan',
    fields: [
      { name: 'childName', label: 'Pangalan ng Bata / Child\'s Full Name', type: 'text', placeholder: 'Juan A. Dela Cruz', required: true },
      { name: 'dateOfBirth', label: 'Petsa ng Kapanganakan / Date of Birth', type: 'date', required: true, halfWidth: true },
      { name: 'placeOfBirth', label: 'Lugar ng Kapanganakan / Place of Birth', type: 'text', placeholder: 'Cortes, Surigao del Sur', required: true, halfWidth: true },
      { name: 'fatherName', label: 'Pangalan ng Ama / Father\'s Full Name', type: 'text', placeholder: 'Full Name', required: true },
      { name: 'motherName', label: 'Pangalan ng Ina / Mother\'s Maiden Name', type: 'text', placeholder: 'Full Maiden Name', required: true },
      { name: 'requestorName', label: 'Pangalan ng Humihiling / Requestor\'s Name', type: 'text', placeholder: 'Your full name', required: true },
      { name: 'relationship', label: 'Relasyon / Relationship to Document Owner', type: 'select', required: true,
        options: [
          { value: 'self', label: 'Sarili (Self)' },
          { value: 'parent', label: 'Magulang (Parent)' },
          { value: 'spouse', label: 'Asawa (Spouse)' },
          { value: 'sibling', label: 'Kapatid (Sibling)' },
          { value: 'authorized', label: 'Awtorisadong Kinatawan (Authorized Rep)' },
        ],
      },
      contactField,
      { name: 'numberOfCopies', label: 'Bilang ng Kopya / Number of Copies', type: 'number', placeholder: '1', required: true, halfWidth: true },
      { ...purposeField, halfWidth: true },
    ],
  },
  {
    value: 'death_certificate',
    label: 'Death Certificate',
    description: 'Kopya ng sertipiko ng kamatayan',
    fields: [
      { name: 'deceasedName', label: 'Pangalan ng Namatay / Deceased\'s Full Name', type: 'text', required: true },
      { name: 'dateOfDeath', label: 'Petsa ng Kamatayan / Date of Death', type: 'date', required: true, halfWidth: true },
      { name: 'placeOfDeath', label: 'Lugar ng Kamatayan / Place of Death', type: 'text', placeholder: 'Cortes, Surigao del Sur', required: true, halfWidth: true },
      { name: 'requestorName', label: 'Pangalan ng Humihiling / Requestor\'s Name', type: 'text', required: true },
      { name: 'relationship', label: 'Relasyon / Relationship', type: 'select', required: true,
        options: [
          { value: 'spouse', label: 'Asawa (Spouse)' },
          { value: 'child', label: 'Anak (Child)' },
          { value: 'parent', label: 'Magulang (Parent)' },
          { value: 'sibling', label: 'Kapatid (Sibling)' },
          { value: 'authorized', label: 'Awtorisadong Kinatawan (Authorized Rep)' },
        ],
      },
      contactField,
      { name: 'numberOfCopies', label: 'Bilang ng Kopya / Number of Copies', type: 'number', placeholder: '1', required: true, halfWidth: true },
      purposeField,
    ],
  },
  {
    value: 'marriage_certificate',
    label: 'Marriage Certificate',
    description: 'Kopya ng sertipiko ng kasal',
    fields: [
      { name: 'husbandName', label: 'Pangalan ng Lalaki / Husband\'s Full Name', type: 'text', required: true },
      { name: 'wifeName', label: 'Pangalan ng Babae / Wife\'s Full Maiden Name', type: 'text', required: true },
      { name: 'dateOfMarriage', label: 'Petsa ng Kasal / Date of Marriage', type: 'date', required: true, halfWidth: true },
      { name: 'placeOfMarriage', label: 'Lugar ng Kasal / Place of Marriage', type: 'text', placeholder: 'Cortes, Surigao del Sur', required: true, halfWidth: true },
      { name: 'requestorName', label: 'Humihiling / Requestor\'s Name', type: 'text', required: true },
      contactField,
      { name: 'numberOfCopies', label: 'Bilang ng Kopya / Number of Copies', type: 'number', placeholder: '1', required: true, halfWidth: true },
      purposeField,
    ],
  },
  {
    value: 'residency_certificate',
    label: 'Certificate of Residency',
    description: 'Patunay ng paninirahan',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      { name: 'yearsOfResidency', label: 'Taon ng Paninirahan / Years of Residency', type: 'number', placeholder: '5', required: true, halfWidth: true },
      contactField,
      purposeField,
    ],
  },
  {
    value: 'indigency_certificate',
    label: 'Certificate of Indigency',
    description: 'Para sa tulong pinansyal / financial assistance',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      occupationField, contactField,
      { name: 'monthlyIncome', label: 'Buwanang Kita / Monthly Income', type: 'text', placeholder: '₱0.00', required: true, halfWidth: true },
      { name: 'numberOfDependents', label: 'Bilang ng Umaasa / No. of Dependents', type: 'number', placeholder: '0', required: true, halfWidth: true },
      { ...purposeField, options: [
        { value: 'medical', label: 'Medikal / Medical Assistance' },
        { value: 'burial', label: 'Libing / Burial Assistance' },
        { value: 'educational', label: 'Edukasyon / Educational Assistance' },
        { value: 'financial', label: 'Pinansyal / Financial Assistance' },
        { value: 'hospital', label: 'Ospital / Hospital Bill' },
        { value: 'other', label: 'Iba pa / Other' },
      ]},
    ],
  },
  {
    value: 'good_moral',
    label: 'Good Moral Certificate',
    description: 'Sertipiko ng mabuting asal',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField,
      purposeField,
    ],
  },
  {
    value: 'business_permit',
    label: 'Business Permit',
    description: 'Bago o renewal ng business permit',
    fields: [
      { name: 'ownerName', label: 'Pangalan ng May-ari / Owner\'s Name', type: 'text', required: true },
      { name: 'businessName', label: 'Pangalan ng Negosyo / Business Name', type: 'text', placeholder: 'e.g., Sari-sari Store ni Juan', required: true },
      { name: 'businessType', label: 'Uri ng Negosyo / Business Type', type: 'select', required: true,
        options: [
          { value: 'sari-sari', label: 'Sari-sari Store' },
          { value: 'eatery', label: 'Karinderya / Eatery' },
          { value: 'retail', label: 'Retail / Tindahan' },
          { value: 'services', label: 'Serbisyo / Services' },
          { value: 'manufacturing', label: 'Paggawa / Manufacturing' },
          { value: 'agriculture', label: 'Agrikultura / Agriculture' },
          { value: 'other', label: 'Iba pa / Other' },
        ],
      },
      { name: 'businessAddress', label: 'Tirahan ng Negosyo / Business Address', type: 'text', required: true },
      { name: 'permitType', label: 'Uri ng Permit', type: 'select', required: true, halfWidth: true,
        options: [
          { value: 'new', label: 'Bago (New)' },
          { value: 'renewal', label: 'Renewal' },
        ],
      },
      contactField,
      { name: 'dtiNumber', label: 'DTI Registration No. (kung meron)', type: 'text', required: false, halfWidth: true },
    ],
  },
  {
    value: 'mayors_permit',
    label: "Mayor's Permit",
    description: 'Para sa operasyon ng negosyo',
    fields: [
      { name: 'ownerName', label: 'Pangalan ng May-ari / Owner\'s Name', type: 'text', required: true },
      { name: 'businessName', label: 'Pangalan ng Negosyo / Business Name', type: 'text', required: true },
      { name: 'businessAddress', label: 'Tirahan ng Negosyo / Business Address', type: 'text', required: true },
      { name: 'permitType', label: 'Uri / Type', type: 'select', required: true, halfWidth: true,
        options: [
          { value: 'new', label: 'Bago (New)' },
          { value: 'renewal', label: 'Renewal' },
        ],
      },
      contactField,
    ],
  },
  {
    value: 'philhealth',
    label: 'PhilHealth Assistance',
    description: 'Tulong sa health insurance',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField,
      { name: 'philhealthNumber', label: 'PhilHealth ID Number (kung meron)', type: 'text', placeholder: 'XX-XXXXXXXXX-X', required: false },
      { name: 'memberType', label: 'Uri ng Miyembro / Member Type', type: 'select', required: true,
        options: [
          { value: 'member', label: 'Miyembro (Direct Member)' },
          { value: 'dependent', label: 'Dependent' },
          { value: 'indigent', label: 'Indigent / Sponsored' },
          { value: 'senior', label: 'Senior Citizen' },
        ],
      },
      { name: 'concern', label: 'Alalahanin / Concern', type: 'textarea', placeholder: 'Describe your PhilHealth concern...', required: true },
    ],
  },
  {
    value: '4ps',
    label: '4Ps Enrollment/Assistance',
    description: 'Pantawid Pamilyang Pilipino Program',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField, occupationField,
      { name: 'monthlyIncome', label: 'Buwanang Kita / Monthly Household Income', type: 'text', placeholder: '₱0.00', required: true, halfWidth: true },
      { name: 'numberOfChildren', label: 'Bilang ng Anak / No. of Children (0-18)', type: 'number', placeholder: '0', required: true, halfWidth: true },
      { name: 'assistanceType', label: 'Uri ng Tulong / Type of Assistance', type: 'select', required: true,
        options: [
          { value: 'enrollment', label: 'Pagpapatala (New Enrollment)' },
          { value: 'update', label: 'Update ng Impormasyon' },
          { value: 'grievance', label: 'Reklamo / Grievance' },
          { value: 'other', label: 'Iba pa / Other' },
        ],
      },
    ],
  },
  {
    value: 'senior_citizen',
    label: 'Senior Citizen ID',
    description: 'Bago o renewal ng Senior Citizen ID',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField,
      { name: 'idType', label: 'Uri / Type', type: 'select', required: true, halfWidth: true,
        options: [
          { value: 'new', label: 'Bago (New)' },
          { value: 'renewal', label: 'Renewal' },
          { value: 'replacement', label: 'Kapalit (Replacement)' },
        ],
      },
      { name: 'emergencyContact', label: 'Emergency Contact Person', type: 'text', required: true },
      { name: 'emergencyNumber', label: 'Emergency Contact Number', type: 'tel', placeholder: '09XX XXX XXXX', required: true },
    ],
  },
  {
    value: 'pwd_id',
    label: 'PWD ID Application',
    description: 'Persons with Disability ID',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField,
      { name: 'disabilityType', label: 'Uri ng Kapansanan / Type of Disability', type: 'select', required: true,
        options: [
          { value: 'physical', label: 'Pisikal (Physical)' },
          { value: 'visual', label: 'Paningin (Visual)' },
          { value: 'hearing', label: 'Pandinig (Hearing)' },
          { value: 'mental', label: 'Mental / Intellectual' },
          { value: 'psychosocial', label: 'Psychosocial' },
          { value: 'learning', label: 'Learning Disability' },
          { value: 'multiple', label: 'Multiple Disabilities' },
        ],
      },
      { name: 'physicianName', label: 'Attending Physician', type: 'text', required: true },
      { name: 'idType', label: 'Uri / Type', type: 'select', required: true, halfWidth: true,
        options: [
          { value: 'new', label: 'Bago (New)' },
          { value: 'renewal', label: 'Renewal' },
        ],
      },
    ],
  },
  {
    value: 'solo_parent',
    label: 'Solo Parent ID',
    description: 'Solo Parent identification card',
    fields: [
      commonNameField,
      { ...birthdateField }, { ...ageField },
      { ...sexField }, { ...civilStatusField, halfWidth: true },
      addressField,
      contactField, occupationField,
      { name: 'numberOfChildren', label: 'Bilang ng Anak / No. of Children', type: 'number', placeholder: '1', required: true, halfWidth: true },
      { name: 'circumstance', label: 'Dahilan / Circumstance', type: 'select', required: true,
        options: [
          { value: 'death_of_spouse', label: 'Namatay ang Asawa' },
          { value: 'separation', label: 'Hiwalay / Separated' },
          { value: 'abandonment', label: 'Iniwan / Abandoned' },
          { value: 'unmarried', label: 'Hindi Kasal / Unmarried' },
          { value: 'detention', label: 'Nakakulong ang Asawa / Detained Spouse' },
          { value: 'ofw', label: 'OFW ang Asawa' },
          { value: 'other', label: 'Iba pa / Other' },
        ],
      },
      { name: 'idType', label: 'Uri / Type', type: 'select', required: true, halfWidth: true,
        options: [
          { value: 'new', label: 'Bago (New)' },
          { value: 'renewal', label: 'Renewal' },
        ],
      },
    ],
  },
  {
    value: 'building_permit',
    label: 'Building Permit',
    description: 'Para sa konstruksyon at renovation',
    fields: [
      { name: 'ownerName', label: 'Pangalan ng May-ari / Property Owner', type: 'text', required: true },
      { name: 'projectType', label: 'Uri ng Proyekto / Project Type', type: 'select', required: true,
        options: [
          { value: 'new_construction', label: 'Bagong Gusali (New Construction)' },
          { value: 'renovation', label: 'Renovasyon (Renovation)' },
          { value: 'addition', label: 'Dagdag (Addition)' },
          { value: 'demolition', label: 'Demolisyon (Demolition)' },
          { value: 'fence', label: 'Bakod (Fencing)' },
        ],
      },
      { name: 'projectLocation', label: 'Lokasyon ng Proyekto / Project Location', type: 'text', required: true },
      { name: 'lotArea', label: 'Lawak ng Lupa / Lot Area (sqm)', type: 'text', placeholder: 'e.g., 150 sqm', required: true, halfWidth: true },
      { name: 'floorArea', label: 'Lawak ng Sahig / Floor Area (sqm)', type: 'text', placeholder: 'e.g., 80 sqm', required: true, halfWidth: true },
      { name: 'estimatedCost', label: 'Tinatayang Gastos / Estimated Cost', type: 'text', placeholder: '₱0.00', required: true, halfWidth: true },
      contactField,
    ],
  },
  {
    value: 'zoning_clearance',
    label: 'Zoning Clearance',
    description: 'Sertipikasyon ng paggamit ng lupa',
    fields: [
      { name: 'applicantName', label: 'Pangalan ng Aplikante / Applicant\'s Name', type: 'text', required: true },
      { name: 'propertyLocation', label: 'Lokasyon ng Lupa / Property Location', type: 'text', required: true },
      { name: 'landUse', label: 'Gamit ng Lupa / Intended Land Use', type: 'select', required: true,
        options: [
          { value: 'residential', label: 'Tirahan (Residential)' },
          { value: 'commercial', label: 'Komersyal (Commercial)' },
          { value: 'industrial', label: 'Industriyal (Industrial)' },
          { value: 'agricultural', label: 'Agrikultural (Agricultural)' },
          { value: 'institutional', label: 'Institutional' },
        ],
      },
      { name: 'lotArea', label: 'Lawak ng Lupa / Lot Area (sqm)', type: 'text', placeholder: '150 sqm', required: true, halfWidth: true },
      contactField,
      purposeField,
    ],
  },
  {
    value: 'other',
    label: 'Iba pang Serbisyo / Other Services',
    description: 'Iba pang serbisyong munisipal',
    fields: [
      commonNameField,
      addressField,
      contactField,
      { name: 'serviceNeeded', label: 'Serbisyong Kailangan / Service Needed', type: 'textarea', placeholder: 'Ilarawan ang kailangan mong serbisyo...', required: true },
    ],
  },
];
