import dayjs from 'dayjs';
import { DEFAULT_STAGES, DEFAULT_CHECKLIST } from '../config/pipeline.js';

const today = dayjs();
const days = (n) => today.add(n, 'day').toISOString();

export function buildSeed() {
  const users = [
    { id: 'u_admin',  name: 'Anita Sharma',  email: 'anita@visavista.test',  role: 'admin' },
    { id: 'u_couns',  name: 'Bibek Thapa',   email: 'bibek@visavista.test',  role: 'counsellor' },
    { id: 'u_couns2', name: 'Sushma Rai',    email: 'sushma@visavista.test', role: 'counsellor' },
  ];

  const students = [
    { id: 's1',  name: 'Roshan Thapa',     phone: '9841-111111', email: 'roshan@example.com',   targetCountry: 'Australia',   leadSource: 'walk-in',   createdBy: 'u_couns',  createdAt: days(-90) },
    { id: 's2',  name: 'Priya Karki',      phone: '9841-222222', email: 'priya@example.com',    targetCountry: 'UK',          leadSource: 'whatsapp',  createdBy: 'u_couns',  createdAt: days(-72) },
    { id: 's3',  name: 'Bibek Shrestha',   phone: '9841-333333', email: 'bshrestha@example.com',targetCountry: 'USA',         leadSource: 'referral',  createdBy: 'u_couns2', createdAt: days(-60) },
    { id: 's4',  name: 'Anita Gurung',     phone: '9841-444444', email: 'agurung@example.com',  targetCountry: 'Canada',      leadSource: 'facebook',  createdBy: 'u_couns2', createdAt: days(-55) },
    { id: 's5',  name: 'Sanjay Magar',     phone: '9841-555555', email: 'sanjay@example.com',   targetCountry: 'Australia',   leadSource: 'walk-in',   createdBy: 'u_couns',  createdAt: days(-48) },
    { id: 's6',  name: 'Kamala Rai',       phone: '9841-666666', email: 'kamala@example.com',   targetCountry: 'New Zealand', leadSource: 'whatsapp',  createdBy: 'u_couns',  createdAt: days(-40) },
    { id: 's7',  name: 'Dev Tamang',       phone: '9841-777777', email: 'dev@example.com',      targetCountry: 'UK',          leadSource: 'referral',  createdBy: 'u_couns2', createdAt: days(-32) },
    { id: 's8',  name: 'Sunita Lama',      phone: '9841-888888', email: 'sunita@example.com',   targetCountry: 'USA',         leadSource: 'walk-in',   createdBy: 'u_couns2', createdAt: days(-25) },
    { id: 's9',  name: 'Kiran Bhandari',   phone: '9841-999999', email: 'kiran@example.com',    targetCountry: 'Canada',      leadSource: 'facebook',  createdBy: 'u_couns',  createdAt: days(-18) },
    { id: 's10', name: 'Meera Poudel',     phone: '9841-000111', email: 'meera@example.com',    targetCountry: 'Australia',   leadSource: 'walk-in',   createdBy: 'u_couns',  createdAt: days(-7) },
  ];

  const cases = [
    {
      id: 'c1', studentId: 's1', counsellorId: 'u_couns', country: 'Australia', intake: 'Feb 2027',
      stage: 'inquiry', nextAction: 'Schedule discovery session', deadline: days(3),
      blocker: '', lastContact: days(-1),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c2', studentId: 's2', counsellorId: 'u_couns', country: 'UK', intake: 'Sep 2026',
      stage: 'counselling', nextAction: 'Recommend 3 universities', deadline: days(5),
      blocker: '', lastContact: days(-2),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c3', studentId: 's3', counsellorId: 'u_couns2', country: 'USA', intake: 'Fall 2026',
      stage: 'test-prep', nextAction: 'Review IELTS mock test results', deadline: days(4),
      blocker: 'PTE score below threshold', lastContact: days(-3),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c4', studentId: 's4', counsellorId: 'u_couns2', country: 'Canada', intake: 'Jan 2027',
      stage: 'application', nextAction: 'Finalise SOP for UofT', deadline: days(8),
      blocker: '', lastContact: days(-1),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c5', studentId: 's5', counsellorId: 'u_couns', country: 'Australia', intake: 'Feb 2027',
      stage: 'offer-received', nextAction: 'Accept Melbourne offer before deadline', deadline: days(7),
      blocker: '', lastContact: days(-2),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c6', studentId: 's6', counsellorId: 'u_couns', country: 'New Zealand', intake: 'Jul 2026',
      stage: 'financials', nextAction: 'Collect GIC proof from bank', deadline: days(2),
      blocker: 'Waiting on father sponsor bank statement', lastContact: days(-4),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c7', studentId: 's7', counsellorId: 'u_couns2', country: 'UK', intake: 'Sep 2026',
      stage: 'visa-lodgement', nextAction: 'Track UKVI decision', deadline: days(14),
      blocker: '', lastContact: days(-3),
      visaStatus: 'Lodged', visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c8', studentId: 's8', counsellorId: 'u_couns2', country: 'USA', intake: 'Fall 2026',
      stage: 'visa-decision', nextAction: 'Review refusal and plan reapplication', deadline: days(-1),
      blocker: 'Visa refused — financial documents', lastContact: days(-5),
      visaStatus: 'Decided', visaOutcome: 'refused',
      refusalCategory: 'Financial Documents',
      refusalDetail: 'Sponsor bank statement balance insufficient — NRs 8 lakh below the NRs 15 lakh requirement for F-1 visa.',
    },
    {
      id: 'c9', studentId: 's9', counsellorId: 'u_couns', country: 'Canada', intake: 'Sep 2026',
      stage: 'pre-departure', nextAction: 'Send pre-departure briefing pack', deadline: days(6),
      blocker: '', lastContact: days(-1),
      visaStatus: 'Decided', visaOutcome: 'granted', refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c10', studentId: 's10', counsellorId: 'u_couns', country: 'Australia', intake: 'Feb 2026',
      stage: 'enrolled', nextAction: 'Confirm enrollment letter received', deadline: days(10),
      blocker: '', lastContact: days(-2),
      visaStatus: 'Decided', visaOutcome: 'granted', refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c11', studentId: 's1', counsellorId: 'u_couns', country: 'Canada', intake: 'Sep 2026',
      stage: 'counselling', nextAction: 'Explore MBA programs in Toronto', deadline: days(9),
      blocker: '', lastContact: days(-3),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
    {
      id: 'c12', studentId: 's3', counsellorId: 'u_couns2', country: 'Canada', intake: 'Jan 2027',
      stage: 'offer-received', nextAction: 'Compare UofT vs UBC conditional offers', deadline: days(12),
      blocker: '', lastContact: days(-2),
      visaStatus: null, visaOutcome: null, refusalCategory: null, refusalDetail: null,
    },
  ];

  const documents = [];
  const stageOrder = DEFAULT_STAGES.map((s) => s.id);
  let docId = 1;
  cases.forEach((c) => {
    DEFAULT_CHECKLIST.forEach((item, idx) => {
      const stageIdx = stageOrder.indexOf(c.stage);
      let status;
      if (stageIdx >= 6) status = idx < 5 ? 'verified' : 'received';
      else if (stageIdx === 5) status = idx < 3 ? 'verified' : idx < 5 ? 'received' : 'pending';
      else if (stageIdx === 4) status = idx < 2 ? 'received' : 'pending';
      else status = idx === 0 ? 'received' : 'pending';
      documents.push({
        id: `d${docId++}`,
        caseId: c.id,
        type: item.id,
        status,
        fileName: status === 'pending' ? '' : `${item.id}_${c.id}.pdf`,
      });
    });
  });

  const tasks = [
    { id: 't1',  caseId: 'c1',  assigneeId: 'u_couns',  title: 'Call Roshan to schedule session',       dueDate: days(3),  done: false, autoCreated: false },
    { id: 't2',  caseId: 'c2',  assigneeId: 'u_couns',  title: 'Send university shortlist to Priya',    dueDate: days(1),  done: false, autoCreated: false },
    { id: 't3',  caseId: 'c3',  assigneeId: 'u_couns2', title: 'IELTS mock test review — Bibek',        dueDate: days(0),  done: false, autoCreated: false },
    { id: 't4',  caseId: 'c4',  assigneeId: 'u_couns2', title: 'SOP draft review — Anita',              dueDate: days(-1), done: false, autoCreated: false },
    { id: 't5',  caseId: 'c5',  assigneeId: 'u_couns',  title: 'Confirm Melbourne offer acceptance',    dueDate: days(7),  done: false, autoCreated: false },
    { id: 't6',  caseId: 'c6',  assigneeId: 'u_couns',  title: 'Follow up on sponsor bank statement',  dueDate: days(-2), done: false, autoCreated: false },
    { id: 't7',  caseId: 'c6',  assigneeId: 'u_couns',  title: 'Collect GIC proof from Kamala',        dueDate: days(2),  done: false, autoCreated: false },
    { id: 't8',  caseId: 'c7',  assigneeId: 'u_couns2', title: 'UKVI appointment reminder',             dueDate: days(10), done: false, autoCreated: true },
    { id: 't9',  caseId: 'c8',  assigneeId: 'u_couns2', title: 'Review refusal reason — Sunita USA',   dueDate: days(1),  done: false, autoCreated: true },
    { id: 't10', caseId: 'c9',  assigneeId: 'u_couns',  title: 'Send pre-departure pack to Kiran',     dueDate: days(6),  done: false, autoCreated: false },
    { id: 't11', caseId: 'c11', assigneeId: 'u_couns',  title: 'MBA shortlist call with Roshan',       dueDate: days(9),  done: false, autoCreated: false },
    { id: 't12', caseId: 'c12', assigneeId: 'u_couns2', title: 'Compare UofT vs UBC offers — Bibek',  dueDate: days(-3), done: false, autoCreated: false },
  ];

  const activity = [
    { id: 'a1',  caseId: 'c1',  type: 'call',    text: 'Initial enquiry call — Roshan interested in nursing at Melbourne. IELTS pending.',                   countryRecommended: 'Australia', courseRecommended: 'Bachelor of Nursing', intake: 'Feb 2027', createdAt: days(-1),  authorId: 'u_couns'  },
    { id: 'a2',  caseId: 'c2',  type: 'meeting', text: 'In-person session — discussed UK business programs. Priya keen on LSE and Manchester.',              countryRecommended: 'UK',        courseRecommended: 'MSc Management',     intake: 'Sep 2026', createdAt: days(-2),  authorId: 'u_couns'  },
    { id: 'a3',  caseId: 'c3',  type: 'note',    text: 'Bibek scored 6.0 on PTE — needs 6.5. Scheduled re-test in 3 weeks.',                                countryRecommended: 'USA',       courseRecommended: 'MS Computer Science', intake: 'Fall 2026', createdAt: days(-3), authorId: 'u_couns2' },
    { id: 'a4',  caseId: 'c4',  type: 'meeting', text: 'SOP workshop session — Anita drafted strong opening. Needs to expand on career goals section.',      countryRecommended: 'Canada',    courseRecommended: 'MBA',                intake: 'Jan 2027', createdAt: days(-1),  authorId: 'u_couns2' },
    { id: 'a5',  caseId: 'c5',  type: 'email',   text: 'Forwarded Melbourne conditional offer to Sanjay. Acceptance deadline is 7 days.',                   countryRecommended: 'Australia', courseRecommended: 'Bachelor of IT',     intake: 'Feb 2027', createdAt: days(-2),  authorId: 'u_couns'  },
    { id: 'a6',  caseId: 'c6',  type: 'call',    text: 'Called Kamala re: GIC — father bank statement still in process. Flagged risk to admin.',             countryRecommended: 'New Zealand', courseRecommended: 'BHM',             intake: 'Jul 2026', createdAt: days(-4),  authorId: 'u_couns'  },
    { id: 'a7',  caseId: 'c7',  type: 'note',    text: 'Lodged UK visa application — UKVI ref LON-2026-09812. Appointment on June 28.',                      countryRecommended: null,        courseRecommended: null,                 intake: null,       createdAt: days(-3),  authorId: 'u_couns2' },
    { id: 'a8',  caseId: 'c8',  type: 'note',    text: 'Visa refused — financial documents. Sunita\'s sponsor balance NRs 8L vs required NRs 15L. Logged refusal reason for pattern tracking.', countryRecommended: null, courseRecommended: null, intake: null, createdAt: days(-5), authorId: 'u_couns2' },
    { id: 'a9',  caseId: 'c9',  type: 'email',   text: 'Sent pre-departure checklist to Kiran. Flight booked for Sep 2. Accommodation confirmed.',           countryRecommended: 'Canada',    courseRecommended: 'MEng',               intake: 'Sep 2026', createdAt: days(-1),  authorId: 'u_couns'  },
    { id: 'a10', caseId: 'c10', type: 'note',    text: 'Meera confirmed enrollment at RMIT. Case closed successfully.',                                       countryRecommended: 'Australia', courseRecommended: 'BDes Interaction',   intake: 'Feb 2026', createdAt: days(-2),  authorId: 'u_couns'  },
    { id: 'a11', caseId: 'c11', type: 'call',    text: 'Roshan interested in Canada for MBA. Discussed Rotman vs Schulich. Strong GMAT candidate.',           countryRecommended: 'Canada',    courseRecommended: 'MBA',                intake: 'Sep 2026', createdAt: days(-3),  authorId: 'u_couns'  },
    { id: 'a12', caseId: 'c12', type: 'email',   text: 'Both UofT and UBC sent conditional offers. Sent comparison sheet to Bibek for review.',              countryRecommended: 'Canada',    courseRecommended: 'MCS',                intake: 'Jan 2027', createdAt: days(-2),  authorId: 'u_couns2' },
  ];

  const offers = [
    { id: 'o1', caseId: 'c5', university: 'University of Melbourne', offerType: 'conditional', acceptanceDeadline: days(7),  conditionalRequirements: 'IELTS 6.5 required before enrollment',         status: 'pending',  createdAt: days(-4) },
    { id: 'o2', caseId: 'c6', university: 'Victoria University of Wellington', offerType: 'unconditional', acceptanceDeadline: days(30), conditionalRequirements: '', status: 'pending',  createdAt: days(-6) },
    { id: 'o3', caseId: 'c9', university: 'University of British Columbia', offerType: 'unconditional', acceptanceDeadline: days(-10), conditionalRequirements: '', status: 'accepted', createdAt: days(-20) },
    { id: 'o4', caseId: 'c10', university: 'RMIT University', offerType: 'unconditional', acceptanceDeadline: days(-45),  conditionalRequirements: '', status: 'accepted', createdAt: days(-55) },
    { id: 'o5', caseId: 'c12', university: 'University of Toronto', offerType: 'conditional', acceptanceDeadline: days(12), conditionalRequirements: 'Final year transcripts required',              status: 'pending',  createdAt: days(-3) },
    { id: 'o6', caseId: 'c12', university: 'University of British Columbia', offerType: 'conditional', acceptanceDeadline: days(15), conditionalRequirements: 'IELTS 7.0 required',                 status: 'pending',  createdAt: days(-2) },
  ];

  const fees = [
    { id: 'f1', caseId: 'c9',  amount: 25000, paymentMethod: 'Bank Transfer', paymentDate: days(-18), receiptNumber: 'VV-2026-001', notes: 'Initial counselling fee', createdBy: 'u_couns',  createdAt: days(-18), voided: false, voidReason: '' },
    { id: 'f2', caseId: 'c10', amount: 25000, paymentMethod: 'Cash',          paymentDate: days(-50), receiptNumber: 'VV-2026-002', notes: 'Counselling fee',        createdBy: 'u_couns',  createdAt: days(-50), voided: false, voidReason: '' },
    { id: 'f3', caseId: 'c10', amount: 10000, paymentMethod: 'eSewa',         paymentDate: days(-30), receiptNumber: 'VV-2026-003', notes: 'Visa lodgement fee',     createdBy: 'u_couns',  createdAt: days(-30), voided: false, voidReason: '' },
    { id: 'f4', caseId: 'c6',  amount: 15000, paymentMethod: 'Khalti',        paymentDate: days(-8),  receiptNumber: 'VV-2026-004', notes: 'Application fee',        createdBy: 'u_couns',  createdAt: days(-8),  voided: false, voidReason: '' },
  ];

  const lodgements = [
    { id: 'l1', caseId: 'c7',  submissionDate: days(-5),  embassyRefNumber: 'UKVI-LON-2026-09812', appointmentDate: days(10), createdBy: 'u_couns2', createdAt: days(-5) },
    { id: 'l2', caseId: 'c8',  submissionDate: days(-20), embassyRefNumber: 'USV-KTM-2026-05678',  appointmentDate: null,     createdBy: 'u_couns2', createdAt: days(-20) },
    { id: 'l3', caseId: 'c9',  submissionDate: days(-30), embassyRefNumber: 'CAN-KTM-2026-03344',  appointmentDate: null,     createdBy: 'u_couns',  createdAt: days(-30) },
    { id: 'l4', caseId: 'c10', submissionDate: days(-60), embassyRefNumber: 'AUS-KTM-2026-01122',  appointmentDate: null,     createdBy: 'u_couns',  createdAt: days(-60) },
  ];

  const config = {
    stages: DEFAULT_STAGES,
    checklist: DEFAULT_CHECKLIST,
  };

  return { users, students, cases, documents, tasks, activity, offers, fees, lodgements, config };
}
