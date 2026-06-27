import { Business, Investor, Investment } from"../types";

export const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style:"currency",
    currency:"INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const MOCK_BUSINESSES: Business[] = [
  {
    id:"b1",
    businessId:"102938",
    name:"Shreeji Textiles",
    ownerName:"Amit Patel",
    registrationDate:"2026-05-10",
    fundingRequired: 500000,
    interestRate: 12.5,
    registrationCommissionPaid: 5000,
    taxPaid: 900,
    status:"listed",
    bankDetails: {
      bankName:"State Bank of India (SBI)",
      accountNumber:"10239084938",
      ifscCode:"SBIN0001029",
      accountHolderName:"AMIT PATEL",
    },
    registrationFee: 5000,
  },
  {
    id:"b2",
    businessId:"495832",
    name:"Balaji Hardware",
    ownerName:"Rajesh Sharma",
    registrationDate:"2026-06-01",
    fundingRequired: 250000,
    interestRate: 14.0,
    registrationCommissionPaid: 2500,
    taxPaid: 450,
    status:"pending",
    bankDetails: {
      bankName:"HDFC Bank",
      accountNumber:"5010043828394",
      ifscCode:"HDFC0000213",
      accountHolderName:"RAJESH SHARMA",
    },
    registrationFee: 2500,
  },
  {
    id:"b3",
    businessId:"984021",
    name:"Radhe Krishna Traders",
    ownerName:"Suresh Desai",
    registrationDate:"2026-04-15",
    fundingRequired: 1000000,
    interestRate: 11.0,
    registrationCommissionPaid: 10000,
    taxPaid: 1800,
    status:"funded",
    bankDetails: {
      bankName:"ICICI Bank",
      accountNumber:"49382093849",
      ifscCode:"ICIC0000321",
      accountHolderName:"SURESH DESAI",
    },
    registrationFee: 10000,
  },
];

export const MOCK_INVESTORS: Investor[] = [
  {
    id:"i1",
    investorId:"983421",
    name:"Nitin Shah",
    totalInvested: 1500000,
    joinDate:"2026-01-10",
    bankDetails: {
      bankName:"HDFC Bank",
      accountNumber:"50100438291039",
      ifscCode:"HDFC0000123",
      accountHolderName:"NITIN SHAH",
    },
    rmasServiceCharge: 15000,
  },
  {
    id:"i2",
    investorId:"104928",
    name:"Viral Mehta",
    totalInvested: 500000,
    joinDate:"2026-03-22",
    bankDetails: {
      bankName:"State Bank of India",
      accountNumber:"38291028394",
      ifscCode:"SBIN0004928",
      accountHolderName:"VIRAL MEHTA",
    },
    rmasServiceCharge: 5000,
  },
];

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id:"inv1",
    businessId:"b3",
    investorId:"i1",
    amount: 1000000,
    timePeriodMonths: 12,
    interestRate: 11.0,
    startDate:"2026-05-01",
    endDate:"2027-05-01",
    adminCommissionInvestor: 10000,
    adminCommissionBusiness: 10000,
    status:"active",
  },
];
