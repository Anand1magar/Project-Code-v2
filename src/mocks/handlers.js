import { http, HttpResponse } from 'msw';
import dayjs from 'dayjs';
import { db } from './db.js';
import { DEFAULT_CHECKLIST } from '../config/pipeline.js';

const ok = (data, status = 200) => HttpResponse.json(data, { status });
const notFound = () => HttpResponse.json({ error: 'not_found' }, { status: 404 });

export const handlers = [
  // --- auth -----------------------------------------------------------
  http.post('/api/auth/login', async ({ request }) => {
    const { email, role } = await request.json();
    const users = db.users.all();
    let user = users.find((u) => u.email === email);
    if (!user && role) user = users.find((u) => u.role === role);
    if (!user) return HttpResponse.json({ error: 'no_user' }, { status: 401 });
    localStorage.setItem('visavista:session', user.id);
    return ok(user);
  }),
  http.get('/api/auth/me', () => {
    const id = localStorage.getItem('visavista:session');
    if (!id) return HttpResponse.json({ error: 'no_session' }, { status: 401 });
    const user = db.users.find(id);
    return user ? ok(user) : notFound();
  }),
  http.post('/api/auth/logout', () => {
    localStorage.removeItem('visavista:session');
    return new HttpResponse(null, { status: 204 });
  }),

  // --- students -------------------------------------------------------
  // Duplicate check must be BEFORE /:id to avoid param collision
  http.get('/api/students/duplicate', ({ request }) => {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone')?.trim();
    const email = url.searchParams.get('email')?.trim().toLowerCase();
    const list = db.students.all();
    const match = list.find((s) =>
      (phone && s.phone === phone) ||
      (email && s.email?.toLowerCase() === email)
    );
    return ok({ match: match ?? null });
  }),
  http.get('/api/students', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const list = db.students.all();
    return ok(q ? list.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.email ?? '').toLowerCase().includes(q) ||
      s.targetCountry.toLowerCase().includes(q) ||
      s.phone.includes(q)
    ) : list);
  }),
  http.get('/api/students/:id', ({ params }) => {
    const s = db.students.find(params.id);
    return s ? ok(s) : notFound();
  }),
  http.post('/api/students', async ({ request }) => {
    const data = await request.json();
    const s = db.students.create({ ...data, createdAt: new Date().toISOString() });
    return ok(s, 201);
  }),
  http.patch('/api/students/:id', async ({ params, request }) => {
    const patch = await request.json();
    const s = db.students.update(params.id, patch);
    return s ? ok(s) : notFound();
  }),
  http.delete('/api/students/:id', ({ params }) => {
    // Cascade: a student's cases, and everything tied to those cases, go with them.
    db.cases.where((c) => c.studentId === params.id).forEach((c) => {
      db.documents.where((d) => d.caseId === c.id).forEach((d) => db.documents.remove(d.id));
      db.tasks.where((t) => t.caseId === c.id).forEach((t) => db.tasks.remove(t.id));
      db.activity.where((a) => a.caseId === c.id).forEach((a) => db.activity.remove(a.id));
      db.offers.where((o) => o.caseId === c.id).forEach((o) => db.offers.remove(o.id));
      db.fees.where((f) => f.caseId === c.id).forEach((f) => db.fees.remove(f.id));
      db.lodgements.where((l) => l.caseId === c.id).forEach((l) => db.lodgements.remove(l.id));
      db.cases.remove(c.id);
    });
    const removed = db.students.remove(params.id);
    return removed ? new HttpResponse(null, { status: 204 }) : notFound();
  }),

  // --- cases ----------------------------------------------------------
  http.get('/api/cases', ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const counsellorId = url.searchParams.get('counsellorId');
    const stage = url.searchParams.get('stage');
    const visaOutcome = url.searchParams.get('visaOutcome');
    let list = db.cases.all();
    if (studentId) list = list.filter((c) => c.studentId === studentId);
    if (counsellorId) list = list.filter((c) => c.counsellorId === counsellorId);
    if (stage) list = list.filter((c) => c.stage === stage);
    if (visaOutcome) list = list.filter((c) => c.visaOutcome === visaOutcome);
    return ok(list);
  }),
  http.get('/api/cases/:id', ({ params }) => {
    const c = db.cases.find(params.id);
    return c ? ok(c) : notFound();
  }),
  http.post('/api/cases', async ({ request }) => {
    const data = await request.json();
    const c = db.cases.create({
      stage: 'inquiry',
      nextAction: '',
      deadline: '',
      blocker: '',
      lastContact: new Date().toISOString(),
      visaStatus: null,
      visaOutcome: null,
      refusalCategory: null,
      refusalDetail: null,
      ...data,
    });
    // Auto-seed a pending document record for every checklist item
    DEFAULT_CHECKLIST.forEach((item) => {
      db.documents.create({ caseId: c.id, type: item.id, status: 'pending', fileName: '' });
    });
    return ok(c, 201);
  }),
  http.patch('/api/cases/:id/stage', async ({ params, request }) => {
    const { stage } = await request.json();
    const c = db.cases.update(params.id, { stage });
    return c ? ok(c) : notFound();
  }),
  http.patch('/api/cases/:id/visa-status', async ({ params, request }) => {
    const { visaStatus } = await request.json();
    const c = db.cases.update(params.id, { visaStatus });
    return c ? ok(c) : notFound();
  }),
  http.patch('/api/cases/:id/decision', async ({ params, request }) => {
    const { outcome, refusalCategory, refusalDetail } = await request.json();
    const now = new Date().toISOString();
    const patch = {
      visaOutcome: outcome,
      visaStatus: 'Decided',
      lastContact: now,
    };
    if (outcome === 'granted') {
      patch.stage = 'pre-departure';
    } else if (outcome === 'refused') {
      patch.stage = 'visa-decision';
      patch.refusalCategory = refusalCategory ?? '';
      patch.refusalDetail = refusalDetail ?? '';
      patch.blocker = `Visa refused — ${refusalCategory ?? 'see details'}`;
      // Auto-task: review refusal reason
      const c = db.cases.find(params.id);
      if (c) {
        db.tasks.create({
          caseId: params.id,
          assigneeId: c.counsellorId,
          title: 'Review refusal reason and plan next steps',
          dueDate: dayjs().add(2, 'day').toISOString(),
          done: false,
          autoCreated: true,
        });
      }
    }
    const updated = db.cases.update(params.id, patch);
    return updated ? ok(updated) : notFound();
  }),
  http.patch('/api/cases/:id', async ({ params, request }) => {
    const patch = await request.json();
    const c = db.cases.update(params.id, patch);
    return c ? ok(c) : notFound();
  }),

  // --- documents ------------------------------------------------------
  http.get('/api/cases/:caseId/documents', ({ params }) => {
    return ok(db.documents.where((d) => d.caseId === params.caseId));
  }),
  http.post('/api/documents', async ({ request }) => {
    const data = await request.json();
    const d = db.documents.create({ status: 'pending', fileName: '', ...data });
    return ok(d, 201);
  }),
  http.patch('/api/documents/:id', async ({ params, request }) => {
    const patch = await request.json();
    const current = db.documents.find(params.id);
    if (!current) return notFound();

    // Version rotation: when a new file arrives and one already exists, push old into versions[]
    if (patch.fileData && current.fileName) {
      const prev = {
        fileName:   current.fileName,
        fileSize:   current.fileSize   ?? null,
        fileType:   current.fileType   ?? null,
        fileData:   current.fileData   ?? null,
        uploadedBy: current.uploadedBy ?? null,
        uploadedAt: current.uploadedAt ?? null,
      };
      patch.versions = [prev, ...(current.versions ?? [])];
    }

    // Auto-task side-effects on status changes
    const newStatus = patch.status;
    if (newStatus && newStatus !== current.status) {
      const docItem = DEFAULT_CHECKLIST.find((item) => item.id === current.type);
      const docLabel = docItem?.label ?? current.type;
      const caseRecord = db.cases.where((c) => c.id === current.caseId)[0];

      if ((newStatus === 'pending') && caseRecord?.counsellorId) {
        db.tasks.create({
          caseId:      current.caseId,
          assigneeId:  caseRecord.counsellorId,
          title:       `Collect ${docLabel} from student`,
          dueDate:     dayjs().add(3, 'day').toISOString(),
          done:        false,
          autoCreated: true,
        });
      }

      if (newStatus === 'received') {
        // Auto-complete any open collect-tasks for this document
        db.tasks.where(
          (t) => t.caseId === current.caseId && t.autoCreated && !t.done && t.title.includes(docLabel),
        ).forEach((t) => db.tasks.update(t.id, { done: true }));
      }

      if (newStatus === 'rejected' && caseRecord?.counsellorId) {
        db.tasks.create({
          caseId:      current.caseId,
          assigneeId:  caseRecord.counsellorId,
          title:       `Collect updated ${docLabel} from student`,
          dueDate:     dayjs().add(3, 'day').toISOString(),
          done:        false,
          autoCreated: true,
        });
      }
    }

    const d = db.documents.update(params.id, patch);
    return d ? ok(d) : notFound();
  }),

  // --- tasks ----------------------------------------------------------
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const assigneeId = url.searchParams.get('assigneeId');
    const caseId = url.searchParams.get('caseId');
    const due = url.searchParams.get('due');
    let list = db.tasks.all();
    if (assigneeId) list = list.filter((t) => t.assigneeId === assigneeId);
    if (caseId) list = list.filter((t) => t.caseId === caseId);
    if (due === 'today') {
      const t = dayjs();
      list = list.filter((x) => !x.done && dayjs(x.dueDate).isSame(t, 'day'));
    } else if (due === 'overdue') {
      const t = dayjs();
      list = list.filter((x) => !x.done && dayjs(x.dueDate).isBefore(t, 'day'));
    }
    return ok(list);
  }),
  http.post('/api/tasks', async ({ request }) => {
    const data = await request.json();
    const t = db.tasks.create({ done: false, autoCreated: false, ...data });
    return ok(t, 201);
  }),
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const patch = await request.json();
    const t = db.tasks.update(params.id, patch);
    return t ? ok(t) : notFound();
  }),

  // --- activity -------------------------------------------------------
  http.get('/api/cases/:caseId/activity', ({ params }) => {
    const list = db.activity.where((a) => a.caseId === params.caseId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return ok(list);
  }),
  http.post('/api/activity', async ({ request }) => {
    const data = await request.json();
    const now = new Date().toISOString();
    const entry = db.activity.create({ createdAt: now, ...data });
    if (entry.caseId) db.cases.update(entry.caseId, { lastContact: now });
    return ok(entry, 201);
  }),

  // --- offers ---------------------------------------------------------
  http.get('/api/cases/:caseId/offers', ({ params }) => {
    return ok(db.offers.where((o) => o.caseId === params.caseId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  }),
  http.post('/api/cases/:caseId/offers', async ({ params, request }) => {
    const data = await request.json();
    const now = new Date().toISOString();
    const offer = db.offers.create({ caseId: params.caseId, status: 'pending', createdAt: now, ...data });
    // Auto-move case to offer-received stage
    db.cases.update(params.caseId, { stage: 'offer-received', lastContact: now });
    return ok(offer, 201);
  }),
  http.patch('/api/offers/:id', async ({ params, request }) => {
    const patch = await request.json();
    const o = db.offers.update(params.id, patch);
    return o ? ok(o) : notFound();
  }),

  // --- fees -----------------------------------------------------------
  http.get('/api/cases/:caseId/fees', ({ params }) => {
    return ok(db.fees.where((f) => f.caseId === params.caseId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  }),
  http.post('/api/cases/:caseId/fees', async ({ request, params }) => {
    const data = await request.json();
    const now = new Date().toISOString();
    const fee = db.fees.create({
      caseId: params.caseId,
      createdAt: now,
      voided: false,
      voidReason: '',
      ...data,
    });
    return ok(fee, 201);
  }),
  http.patch('/api/fees/:id', async ({ params, request }) => {
    const patch = await request.json();
    const f = db.fees.update(params.id, patch);
    return f ? ok(f) : notFound();
  }),

  // --- lodgements -----------------------------------------------------
  http.get('/api/cases/:caseId/lodgement', ({ params }) => {
    const list = db.lodgements.where((l) => l.caseId === params.caseId);
    return ok(list[0] ?? null);
  }),
  http.post('/api/cases/:caseId/lodgement', async ({ params, request }) => {
    const data = await request.json();
    const now = new Date().toISOString();
    const lodgement = db.lodgements.create({ caseId: params.caseId, createdAt: now, ...data });
    // Auto-move to visa-lodgement stage + set visaStatus
    db.cases.update(params.caseId, {
      stage: 'visa-lodgement',
      visaStatus: 'Lodged',
      lastContact: now,
    });
    // Auto-task if appointment date set
    if (data.appointmentDate) {
      const c = db.cases.find(params.caseId);
      if (c) {
        db.tasks.create({
          caseId: params.caseId,
          assigneeId: c.counsellorId,
          title: 'Visa appointment reminder',
          dueDate: data.appointmentDate,
          done: false,
          autoCreated: true,
        });
      }
    }
    return ok(lodgement, 201);
  }),

  // --- dashboard ------------------------------------------------------
  http.get('/api/dashboard', ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const userId = url.searchParams.get('userId');
    const cfg = db.config.get();
    let cases = db.cases.all();
    if (role === 'counsellor' && userId) cases = cases.filter((c) => c.counsellorId === userId);

    const today = dayjs();
    const thisMonthStart = today.startOf('month');

    const byStage = cfg.stages.map((s) => ({
      stage: s.id,
      label: s.label,
      count: cases.filter((c) => c.stage === s.id).length,
    }));

    const atRisk = cases.filter(
      (c) => c.deadline && dayjs(c.deadline).isBefore(today, 'day') && c.stage !== 'enrolled'
    );

    const enrolledThisMonth = cases.filter(
      (c) => c.stage === 'enrolled' && dayjs(c.lastContact).isAfter(thisMonthStart)
    ).length;

    const allCases = db.cases.all();
    const totalEnrolled = allCases.filter((c) => c.stage === 'enrolled').length;
    const conversionRate = allCases.length > 0
      ? Math.round((totalEnrolled / allCases.length) * 100)
      : 0;

    let activity = db.activity.all();
    if (role === 'counsellor' && userId) {
      const caseIds = new Set(cases.map((c) => c.id));
      activity = activity.filter((a) => caseIds.has(a.caseId));
    }
    // Enrich recent activity entries with student name + id for the dashboard timeline
    const recent = activity
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 10)
      .map((a) => {
        const caseRecord = db.cases.find(a.caseId);
        const student    = caseRecord ? db.students.find(caseRecord.studentId) : null;
        return { ...a, studentName: student?.name ?? null, studentId: student?.id ?? null };
      });

    let tasks = [];
    if (role === 'counsellor' && userId) {
      const allTasks = db.tasks.where((t) => t.assigneeId === userId && !t.done);
      tasks = allTasks.sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
    }

    const refusedCount = allCases.filter((c) => c.visaOutcome === 'refused').length;

    return ok({
      totals: {
        activeCases: cases.filter((c) => c.stage !== 'enrolled').length,
        atRisk: atRisk.length,
        enrolledThisMonth,
        conversionRate,
        totalEnrolled,
        totalCases: allCases.length,
      },
      byStage,
      refusedCount,
      atRisk,
      recent,
      tasks,
      myCases: role === 'counsellor' ? cases : [],
    });
  }),

  // --- ask visa vista -------------------------------------------------
  http.post('/api/ask', async ({ request }) => {
    const { query, userId, role } = await request.json();
    const q = query.toLowerCase().trim();
    const now = dayjs();

    const allCases     = db.cases.all();
    const allStudents  = db.students.all();
    const allTasks     = db.tasks.all();
    const allFees      = db.fees.all();
    const allDocuments = db.documents.all();
    const allUsers     = db.users.all();
    const allActivity  = db.activity.all();

    // Role-scoped subsets
    const cases = role === 'counsellor'
      ? allCases.filter((c) => c.counsellorId === userId)
      : allCases;
    const tasks = role === 'counsellor'
      ? allTasks.filter((t) => t.assigneeId === userId)
      : allTasks;

    const studentsById = Object.fromEntries(allStudents.map((s) => [s.id, s]));
    const usersById    = Object.fromEntries(allUsers.map((u) => [u.id, u]));

    const DOC_LABELS = {
      passport: 'Passport', transcripts: 'Academic Transcripts',
      ielts: 'IELTS / PTE / TOEFL', sop: 'Statement of Purpose',
      lor: 'Letters of Recommendation', financials: 'Financial Documents',
      gic: 'GIC / Bank Statement',
    };

    function fmtNames(list, max = 5) {
      if (list.length === 0) return 'none';
      const shown = list.slice(0, max).join(', ');
      return list.length > max ? `${shown} and ${list.length - max} more` : shown;
    }

    const respond = (answer, followUps = [], actions = []) =>
      ok({ answer, followUps, actions });

    // Find a student whose name appears in the query
    const mentionedStudent = allStudents.find((s) => {
      const first = s.name.split(' ')[0].toLowerCase();
      return q.includes(s.name.toLowerCase()) || q.includes(first);
    });

    // Find a counsellor whose name appears in the query
    const mentionedUser = allUsers.find((u) => {
      if (u.role === 'admin') return false;
      const first = u.name.split(' ')[0].toLowerCase();
      return q.includes(u.name.toLowerCase()) || q.includes(first);
    });

    // ── Student-specific queries ────────────────────────────────────────
    if (mentionedStudent) {
      const name = mentionedStudent.name;
      const first = name.split(' ')[0];
      const studentCases = cases.filter((c) => c.studentId === mentionedStudent.id);
      const latestCase = studentCases[0];

      if ((q.includes('open') || q.includes('show case')) && latestCase) {
        return respond(
          `Opening ${name}'s case.`,
          [`What stage is ${first}'s case at?`, `What documents is ${first} missing?`],
          [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }],
        );
      }

      if (q.includes('stage') && latestCase) {
        const stageLabel = latestCase.stage.replace(/-/g, ' ');
        return respond(
          `${name}'s case is in the ${stageLabel} stage (${latestCase.country}). Next action: ${latestCase.nextAction || 'none set'}.`,
          [`What documents is ${first} missing?`, `When was ${first} last contacted?`, `What tasks are open for ${first}?`],
          [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }],
        );
      }

      if (q.includes('last contact') || q.includes('last time') || q.includes('contacted')) {
        const contactDate = latestCase?.lastContact
          ? dayjs(latestCase.lastContact).format('D MMM YYYY')
          : 'unknown';
        const lastNote = allActivity
          .filter((a) => a.caseId === latestCase?.id)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
        const noteText = lastNote
          ? ` Last note: "${lastNote.text.slice(0, 80)}${lastNote.text.length > 80 ? '…' : ''}"`
          : '';
        return respond(
          `${name} was last contacted on ${contactDate}.${noteText}`,
          [`What stage is ${first}'s case at?`, `What documents is ${first} missing?`],
        );
      }

      if (q.includes('missing') || q.includes('document')) {
        const docStatuses = allDocuments.filter((d) => d.caseId === latestCase?.id);
        const pending  = docStatuses.filter((d) => d.status === 'pending');
        const verified = docStatuses.filter((d) => d.status === 'verified');
        if (pending.length === 0) {
          return respond(
            `${name} has all documents submitted. ${verified.length} verified.`,
            [`What stage is ${first}'s case at?`, `Open ${first}'s case`],
            latestCase ? [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }] : [],
          );
        }
        const pendingLabels  = pending.map((d) => DOC_LABELS[d.type] ?? d.type).join(', ');
        const verifiedLabels = verified.slice(0, 3).map((d) => DOC_LABELS[d.type] ?? d.type).join(', ');
        return respond(
          `${name} still needs to submit: ${pendingLabels}.${verifiedLabels ? ` Already verified: ${verifiedLabels}.` : ''}`,
          [`Send a reminder to ${first}`, `What stage is ${first}'s case at?`, `When was ${first} last contacted?`],
          latestCase ? [{ label: `Open ${name}'s documents`, path: `/cases/${latestCase.id}` }] : [],
        );
      }

      if (q.includes('task') || q.includes('do for') || q.includes('do next') || (q.includes('what') && q.includes('next'))) {
        const studentTasks = tasks.filter((t) => t.caseId === latestCase?.id && !t.done);
        if (studentTasks.length === 0) {
          return respond(
            `No open tasks for ${name} right now.`,
            [`What stage is ${first}'s case at?`, `What documents is ${first} missing?`],
            latestCase ? [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }] : [],
          );
        }
        const taskList = studentTasks.slice(0, 3).map((t) => `"${t.title}"`).join(', ');
        return respond(
          `You have ${studentTasks.length} open task${studentTasks.length !== 1 ? 's' : ''} for ${name}: ${taskList}.`,
          [`Open ${first}'s case`, `What documents is ${first} missing?`],
          latestCase ? [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }] : [],
        );
      }

      if (latestCase) {
        const stageLabel = latestCase.stage.replace(/-/g, ' ');
        return respond(
          `${name} is in the ${stageLabel} stage (${latestCase.country}). Next action: ${latestCase.nextAction || 'none set'}.`,
          [`What documents is ${first} missing?`, `When was ${first} last contacted?`, `What tasks are open for ${first}?`],
          [{ label: `Open ${name}'s case`, path: `/cases/${latestCase.id}` }],
        );
      }
    }

    // ── Navigation queries ──────────────────────────────────────────────
    if ((q.includes('show') || q.includes('open')) && q.includes('refused') && q.includes('australia')) {
      const refusedAus = allCases.filter((c) => c.visaOutcome === 'refused' && c.country === 'Australia');
      const names = refusedAus.map((c) => studentsById[c.studentId]?.name).filter(Boolean);
      return respond(
        `${refusedAus.length} Australia case${refusedAus.length !== 1 ? 's were' : ' was'} refused — ${fmtNames(names)}.`,
        ['What is the most common refusal reason?', 'How many Australia cases are still active?'],
        [{ label: 'Open refused Australia cases', path: '/pipeline' }],
      );
    }

    if ((q.includes('show') || q.includes('open')) && q.includes('overdue') && !q.includes('task')) {
      const overdue = cases.filter(
        (c) => c.deadline && dayjs(c.deadline).isBefore(now, 'day') && c.stage !== 'enrolled',
      );
      const names = overdue.map((c) => `${studentsById[c.studentId]?.name} (${c.country})`).filter(Boolean);
      return respond(
        `${overdue.length} overdue case${overdue.length !== 1 ? 's' : ''}: ${fmtNames(names)}.`,
        ['Which counsellor is responsible?', 'What are the next actions on these cases?'],
        [{ label: 'Open pipeline', path: '/pipeline' }],
      );
    }

    // ── Document queries ─────────────────────────────────────────────────
    if (q.includes('bank statement') || (q.includes('bank') && q.includes('gic')) || q.includes('waiting on bank')) {
      const pending = allDocuments.filter((d) => d.type === 'gic' && d.status === 'pending');
      const scoped  = role === 'counsellor'
        ? pending.filter((d) => cases.some((c) => c.id === d.caseId))
        : pending;
      const names = scoped.map((d) => {
        const c = allCases.find((c) => c.id === d.caseId);
        return c ? studentsById[c.studentId]?.name : null;
      }).filter(Boolean);
      return respond(
        `${scoped.length} ${role === 'counsellor' ? 'of your ' : ''}case${scoped.length !== 1 ? 's are' : ' is'} waiting on a GIC / Bank Statement — ${fmtNames(names)}.`,
        ['Which cases have missing documents?', "Which students haven't submitted their IELTS?"],
      );
    }

    if (q.includes('ielts') && (q.includes('submit') || q.includes('certificate') || q.includes('missing') || q.includes("haven"))) {
      const pending = allDocuments.filter((d) => d.type === 'ielts' && d.status === 'pending');
      const scoped  = role === 'counsellor'
        ? pending.filter((d) => cases.some((c) => c.id === d.caseId))
        : pending;
      const names = scoped.map((d) => {
        const c = allCases.find((c) => c.id === d.caseId);
        return c ? studentsById[c.studentId]?.name : null;
      }).filter(Boolean);
      return respond(
        `${scoped.length} student${scoped.length !== 1 ? "s haven't" : " hasn't"} submitted their IELTS / PTE certificate — ${fmtNames(names)}.`,
        ['Which cases have missing documents?', 'How many cases are waiting on a bank statement?'],
      );
    }

    if (q.includes('missing document') || q.includes('incomplete document') || (q.includes('missing') && q.includes('doc'))) {
      const caseIdsWithPending = new Set(
        allDocuments.filter((d) => d.status === 'pending').map((d) => d.caseId),
      );
      const casesWithMissing = cases.filter(
        (c) => caseIdsWithPending.has(c.id) && c.stage !== 'enrolled',
      );
      const list = casesWithMissing.map((c) => {
        const missing = allDocuments.filter((d) => d.caseId === c.id && d.status === 'pending');
        const topTwo  = missing.slice(0, 2).map((d) => DOC_LABELS[d.type] ?? d.type).join(', ');
        return `${studentsById[c.studentId]?.name} (missing ${topTwo})`;
      });
      return respond(
        `${casesWithMissing.length} case${casesWithMissing.length !== 1 ? 's have' : ' has'} missing documents — ${fmtNames(list, 4)}.`,
        ['How many cases are waiting on a bank statement?', "Which students haven't submitted their IELTS?", 'Which cases are overdue?'],
      );
    }

    // ── Fee queries ───────────────────────────────────────────────────────
    if (q.includes('fee') && (q.includes('no fee') || q.includes('without fee') || q.includes('not logged') || q.includes('none logged'))) {
      const caseIdsWithFees = new Set(allFees.filter((f) => !f.voided).map((f) => f.caseId));
      const casesNoFee = cases.filter(
        (c) => !caseIdsWithFees.has(c.id) && c.stage !== 'inquiry',
      );
      const names = casesNoFee.map((c) => studentsById[c.studentId]?.name).filter(Boolean);
      return respond(
        `${casesNoFee.length} case${casesNoFee.length !== 1 ? 's have' : ' has'} no fee logged yet — ${fmtNames(names)}.`,
        ['How much has been collected in fees this month?', 'Which cases have missing documents?'],
      );
    }

    if (mentionedUser && q.includes('fee')) {
      const userCaseIds = new Set(allCases.filter((c) => c.counsellorId === mentionedUser.id).map((c) => c.id));
      const userFees    = allFees.filter((f) => userCaseIds.has(f.caseId) && !f.voided);
      const total       = userFees.reduce((s, f) => s + (f.amount || 0), 0);
      return respond(
        `${mentionedUser.name} has collected NPR ${total.toLocaleString()} across ${userFees.length} receipt${userFees.length !== 1 ? 's' : ''}.`,
        ['How much has been collected in fees this month?', 'Which cases have no fee logged yet?'],
      );
    }

    if (q.includes('fee') && (q.includes('collect') || q.includes('how much') || q.includes('month') || q.includes('total'))) {
      const scopedFees = role === 'counsellor'
        ? allFees.filter((f) => cases.some((c) => c.id === f.caseId) && !f.voided)
        : allFees.filter((f) => !f.voided);
      const thisMonth  = scopedFees.filter((f) => dayjs(f.paymentDate).isAfter(now.startOf('month')));
      const monthTotal = thisMonth.reduce((s, f) => s + (f.amount || 0), 0);
      const allTotal   = scopedFees.reduce((s, f) => s + (f.amount || 0), 0);
      return respond(
        `NPR ${monthTotal.toLocaleString()} collected this month (${thisMonth.length} receipt${thisMonth.length !== 1 ? 's' : ''}). All-time total: NPR ${allTotal.toLocaleString()}.`,
        ['Which cases have no fee logged yet?', 'Which counsellor collected the most?'],
      );
    }

    // ── Refusal queries ───────────────────────────────────────────────────
    if (q.includes('refus')) {
      const refused = allCases.filter((c) => c.visaOutcome === 'refused');

      if (q.includes('reason') || q.includes('common')) {
        const byCategory = {};
        refused.forEach((c) => {
          const cat = c.refusalCategory || 'Unknown';
          byCategory[cat] = (byCategory[cat] || 0) + 1;
        });
        const sorted  = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
        const summary = sorted.map(([cat, n]) => `${cat} (${n})`).join(', ');
        return respond(
          refused.length === 0 ? 'No refusals recorded yet.' : `Most common refusal reasons: ${summary}.`,
          ['Which country has the most refusals?', 'Show me all refused cases for Australia', 'How many visa refusals in total?'],
        );
      }

      if (q.includes('country') || q.includes('which country')) {
        const byCountry = {};
        refused.forEach((c) => { byCountry[c.country] = (byCountry[c.country] || 0) + 1; });
        const sorted  = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
        const top     = sorted[0];
        const summary = sorted.map(([country, n]) => `${country} (${n})`).join(', ');
        return respond(
          refused.length === 0
            ? 'No refusals recorded yet.'
            : `${top?.[0]} has the most refusals (${top?.[1]}). Breakdown: ${summary}.`,
          ['What are the most common refusal reasons?', 'Show me all refused cases for Australia'],
        );
      }

      if (q.includes('australia')) {
        const aus   = refused.filter((c) => c.country === 'Australia');
        const names = aus.map((c) => `${studentsById[c.studentId]?.name} (${c.refusalCategory || 'reason unknown'})`).filter(Boolean);
        return respond(
          aus.length === 0
            ? 'No Australia refusals recorded.'
            : `${aus.length} Australia case${aus.length !== 1 ? 's were' : ' was'} refused — ${fmtNames(names)}.`,
          ['What is the most common refusal reason?', 'How many Australia cases are still active?'],
          [{ label: 'Open refused Australia cases', path: '/pipeline' }],
        );
      }

      const names = refused.map((c) => `${studentsById[c.studentId]?.name} (${c.country})`).filter(Boolean);
      return respond(
        refused.length === 0
          ? 'No visa refusals recorded yet. Good news!'
          : `${refused.length} visa refusal${refused.length !== 1 ? 's' : ''} in total — ${fmtNames(names)}.`,
        ['What are the most common refusal reasons?', 'Which country has the most refusals?', 'Show me all refused cases for Australia'],
      );
    }

    // ── Team performance (admin only) ─────────────────────────────────────
    if (role === 'admin' && (q.includes('counsellor') || q.includes('team') || q.includes('who has') || q.includes('who logged'))) {
      const counsellors = allUsers.filter((u) => u.role === 'counsellor');

      if (q.includes('most case') || q.includes('most active case')) {
        const byCounsellor = counsellors
          .map((u) => ({ name: u.name, count: allCases.filter((c) => c.counsellorId === u.id && c.stage !== 'enrolled').length }))
          .sort((a, b) => b.count - a.count);
        const top     = byCounsellor[0];
        const summary = byCounsellor.map((x) => `${x.name} (${x.count})`).join(', ');
        return respond(
          `${top?.name} has the most active cases (${top?.count}). Breakdown: ${summary}.`,
          ['Who has the most overdue tasks?', 'Which counsellor logged the most activity this week?'],
        );
      }

      if (q.includes('overdue task') || q.includes('most overdue')) {
        const byCounsellor = counsellors
          .map((u) => ({
            name: u.name,
            count: allTasks.filter((t) => t.assigneeId === u.id && !t.done && dayjs(t.dueDate).isBefore(now, 'day')).length,
          }))
          .sort((a, b) => b.count - a.count);
        const top     = byCounsellor[0];
        const summary = byCounsellor.map((x) => `${x.name} (${x.count})`).join(', ');
        return respond(
          top?.count === 0
            ? 'No counsellor has overdue tasks right now.'
            : `${top?.name} has the most overdue tasks (${top?.count}). Breakdown: ${summary}.`,
          ['Which counsellor has the most active cases?', 'Show me all overdue cases'],
        );
      }

      if (q.includes('activity') || q.includes('logged') || q.includes('this week')) {
        const weekStart    = now.subtract(7, 'day');
        const byCounsellor = counsellors
          .map((u) => ({
            name: u.name,
            count: allActivity.filter((a) => a.authorId === u.id && dayjs(a.createdAt).isAfter(weekStart)).length,
          }))
          .sort((a, b) => b.count - a.count);
        const top     = byCounsellor[0];
        const summary = byCounsellor.map((x) => `${x.name} (${x.count})`).join(', ');
        return respond(
          `${top?.name} logged the most activity this week (${top?.count} entries). Breakdown: ${summary}.`,
          ['Which counsellor has the most active cases?', 'Who has the most overdue tasks?'],
        );
      }
    }

    // ── Task queries ──────────────────────────────────────────────────────
    if (q.includes('task')) {
      if (q.includes('today') || q.includes('due today')) {
        const todayTasks = tasks.filter((t) => !t.done && dayjs(t.dueDate).isSame(now, 'day'));
        if (todayTasks.length === 0) {
          return respond(
            'No tasks due today. Check your upcoming tasks.',
            ['Which of my tasks are overdue?', 'How many cases am I managing right now?'],
          );
        }
        const list = todayTasks.slice(0, 4).map((t) => `"${t.title}"`).join(', ');
        return respond(
          `${todayTasks.length} task${todayTasks.length !== 1 ? 's' : ''} due today: ${list}.`,
          ['Which of my tasks are overdue?', 'Which of my cases are overdue?'],
          [{ label: 'Open tasks', path: '/tasks' }],
        );
      }

      if (q.includes('overdue') || q.includes('past due')) {
        const overdueTasks = tasks.filter((t) => !t.done && dayjs(t.dueDate).isBefore(now, 'day'));
        if (overdueTasks.length === 0) {
          return respond("No overdue tasks. You're all caught up!", ['What tasks do I have due today?']);
        }
        const list = overdueTasks.slice(0, 4).map((t) => `"${t.title}"`).join(', ');
        return respond(
          `${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}: ${list}.`,
          ['What tasks do I have due today?', 'Which of my cases are overdue?'],
          [{ label: 'Open tasks', path: '/tasks' }],
        );
      }
    }

    // ── Conversion rate ───────────────────────────────────────────────────
    if (q.includes('conversion rate') || q.includes('conversion')) {
      const totalCases       = allCases.length;
      const enrolled         = allCases.filter((c) => c.stage === 'enrolled').length;
      const rate             = totalCases > 0 ? Math.round((enrolled / totalCases) * 100) : 0;
      const thisMonthEnrolled = allCases.filter(
        (c) => c.stage === 'enrolled' && dayjs(c.lastContact).isAfter(now.startOf('month')),
      ).length;
      return respond(
        `Conversion rate is ${rate}% — ${enrolled} of ${totalCases} cases enrolled. ${thisMonthEnrolled} enrolled this month.`,
        ['Which students enrolled this month?', 'Which stage are most cases stuck at?', 'How many active cases do we have?'],
      );
    }

    // ── Enrolled this month ───────────────────────────────────────────────
    if (q.includes('enrolled') && (q.includes('month') || q.includes('this month') || q.includes('how many'))) {
      const thisMonth = allCases.filter(
        (c) => c.stage === 'enrolled' && dayjs(c.lastContact).isAfter(now.startOf('month')),
      );
      const names = thisMonth.map((c) => studentsById[c.studentId]?.name).filter(Boolean);
      return respond(
        `${thisMonth.length} student${thisMonth.length !== 1 ? 's were' : ' was'} enrolled this month${names.length ? ` — ${fmtNames(names)}` : ''}.`,
        ['What is our conversion rate?', 'How many active cases do we have right now?'],
      );
    }

    // ── Stage with most cases ─────────────────────────────────────────────
    if (q.includes('stage') && (q.includes('most') || q.includes('busiest') || q.includes('highest') || q.includes('breakdown'))) {
      const byStage = {};
      cases.forEach((c) => { byStage[c.stage] = (byStage[c.stage] || 0) + 1; });
      const sorted    = Object.entries(byStage).sort((a, b) => b[1] - a[1]);
      const top       = sorted[0];
      const topLabel  = (top?.[0] ?? '').replace(/-/g, ' ');
      const breakdown = sorted.map(([s, n]) => `${s.replace(/-/g, ' ')} (${n})`).join(', ');
      return respond(
        `The ${topLabel} stage has the most cases (${top?.[1]}). Full breakdown: ${breakdown}.`,
        ['How many active cases do we have?', 'Show me all cases that are overdue', 'What is our conversion rate?'],
      );
    }

    // ── No next action ────────────────────────────────────────────────────
    if (q.includes('no next action') || q.includes('no action set') || q.includes('no action')) {
      const noAction = cases.filter((c) => !c.nextAction || c.nextAction.trim() === '');
      const names    = noAction.map((c) => `${studentsById[c.studentId]?.name} (${c.stage.replace(/-/g, ' ')})`).filter(Boolean);
      return respond(
        noAction.length === 0
          ? 'All cases have a next action set. Good rhythm.'
          : `${noAction.length} case${noAction.length !== 1 ? 's have' : ' has'} no next action set — ${fmtNames(names)}.`,
        ['Show me all cases that are overdue', 'How many active cases do we have?'],
      );
    }

    // ── Overdue cases ─────────────────────────────────────────────────────
    if (q.includes('overdue') && !q.includes('task')) {
      const overdue = cases.filter(
        (c) => c.deadline && dayjs(c.deadline).isBefore(now, 'day') && c.stage !== 'enrolled',
      );
      if (overdue.length === 0) {
        return respond(
          'No overdue cases right now.',
          ['How many active cases do we have?', 'What is our conversion rate?'],
        );
      }
      const names = overdue.map((c) => {
        const s = studentsById[c.studentId];
        const u = usersById[c.counsellorId];
        return `${s?.name} (${c.country}, ${u?.name ?? 'unassigned'})`;
      }).filter(Boolean);
      return respond(
        `${overdue.length} overdue case${overdue.length !== 1 ? 's' : ''} — ${fmtNames(names)}.`,
        ['Which counsellor is responsible?', 'What are the next actions?'],
        [{ label: 'View overdue cases in pipeline', path: '/pipeline' }],
      );
    }

    // ── Active cases / how many cases ────────────────────────────────────
    if (q.includes('active case') || (q.includes('how many') && q.includes('case')) || q.includes('managing')) {
      const active      = cases.filter((c) => c.stage !== 'enrolled');
      const byCountry   = {};
      active.forEach((c) => { byCountry[c.country] = (byCountry[c.country] || 0) + 1; });
      const topCountries = Object.entries(byCountry)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([country, n]) => `${country} (${n})`)
        .join(', ');
      return respond(
        `${active.length} active case${active.length !== 1 ? 's' : ''} right now. Top countries: ${topCountries}.`,
        ['Which stage has the most cases?', 'Show me all cases that are overdue', 'What is our conversion rate?'],
        [{ label: 'Open pipeline', path: '/pipeline' }],
      );
    }

    // ── Default ───────────────────────────────────────────────────────────
    const defaultFollowUps = role === 'admin'
      ? ['How many active cases do we have right now?', 'Which stage has the most cases?', 'How many visa refusals do we have?']
      : ['Which of my cases are overdue?', 'What tasks do I have due today?', 'Which of my students have missing documents?'];

    return respond(
      "I couldn't find a clear answer for that. Try asking about your cases, a specific student by name, documents, fees, or the pipeline.",
      defaultFollowUps,
    );
  }),

  // --- config + users -------------------------------------------------
  http.get('/api/config/pipeline', () => ok(db.config.get())),
  http.patch('/api/config/pipeline', async ({ request }) => {
    const patch = await request.json();
    return ok(db.config.update(patch));
  }),
  http.get('/api/users', () => ok(db.users.all())),
  http.post('/api/users', async ({ request }) => {
    const data = await request.json();
    return ok(db.users.create({ role: 'counsellor', status: 'active', ...data }), 201);
  }),
  http.patch('/api/users/:id', async ({ params, request }) => {
    const patch = await request.json();
    const u = db.users.update(params.id, patch);
    return u ? ok(u) : notFound();
  }),
];
