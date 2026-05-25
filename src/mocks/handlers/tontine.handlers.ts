import { HttpResponse, http } from 'msw';
import { MemberStatus } from '../../app/core/enums/member-status.enum';
import { TontineStatus } from '../../app/core/enums/tontine-status.enum';
import { UserRole } from '../../app/core/enums/user-role.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type { Member } from '../../app/shared/models/entities/member.model';
import type {
  ContributionFrequency,
  FounderInvite,
  Tontine,
  TontineRules,
} from '../../app/shared/models/entities/tontine.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const err = (code: string, message: string, status: number) =>
  HttpResponse.json(
    { code, message, status, timestamp: new Date().toISOString() },
    { status },
  );

const getUserIdFromAuth = (request: Request): string | null => {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer mock-access-(user-\d+)-\d+$/);
  return match ? match[1] : null;
};

export interface CreateTontinePayload {
  name: string;
  description?: string;
  startDate: string;
  contributionAmount: number;
  frequency: ContributionFrequency;
  maxMembers: number;
  rules: TontineRules;
  founders: FounderInvite[];
}

export const tontineHandlers = [
  http.get(`${base}/tontines`, ({ request }) => {
    if (!getUserIdFromAuth(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.tontines));
  }),

  http.get(`${base}/tontines/mine`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const myMembers = db.members.filter((m) => m.userId === userId);
    const tontineIds = new Set(myMembers.map((m) => m.tontineId));
    const mine = db.tontines.filter((t) => tontineIds.has(t.id));
    return HttpResponse.json(wrap(mine));
  }),

  http.post(`${base}/tontines`, async ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as CreateTontinePayload;

    if (!body.name?.trim()) {
      return err('NAME_REQUIRED', 'Le nom de la tontine est obligatoire.', 422);
    }
    if (!body.contributionAmount || body.contributionAmount <= 0) {
      return err('INVALID_AMOUNT', 'Montant de cotisation invalide.', 422);
    }
    if (!body.maxMembers || body.maxMembers < 3) {
      return err('INVALID_MAX_MEMBERS', 'Le nombre maximum de membres doit être au moins 3.', 422);
    }
    if (!body.startDate) {
      return err('DATE_REQUIRED', 'Date de démarrage requise.', 422);
    }
    if (
      body.rules.emergencyDeductionPercent < 0 ||
      body.rules.operationsDeductionPercent < 0 ||
      body.rules.emergencyDeductionPercent + body.rules.operationsDeductionPercent > 100
    ) {
      return err('INVALID_DEDUCTIONS', 'Les prélèvements doivent être entre 0 et 100%.', 422);
    }

    const creator = db.users.find((u) => u.id === userId);
    if (!creator) return new HttpResponse(null, { status: 404 });

    const now = new Date().toISOString();
    const tontineId = `tontine-${db.tontines.length + 1}-${Date.now()}`;

    // Donner le rôle PRESIDENT au créateur si pas déjà présent
    if (!creator.roles.includes(UserRole.PRESIDENT)) {
      creator.roles = [...creator.roles, UserRole.PRESIDENT];
    }

    const tontine: Tontine = {
      id: tontineId,
      name: body.name.trim(),
      description: body.description?.trim(),
      status: TontineStatus.DRAFT,
      contributionAmount: body.contributionAmount,
      frequency: body.frequency,
      startDate: body.startDate,
      memberCount: 1 + body.founders.length,
      maxMembers: body.maxMembers,
      totalSaved: 0,
      createdAt: now,
      updatedAt: now,
      createdByUserId: userId,
      rules: body.rules,
      founders: body.founders,
    };
    db.tontines.push(tontine);

    // Créer un membre pour le créateur (Président)
    const creatorMember: Member = {
      id: `member-${db.members.length + 1}-${Date.now()}`,
      userId,
      tontineId,
      matricule: `TC-${new Date().getFullYear()}-${String(db.members.length + 1).padStart(3, '0')}`,
      firstName: creator.firstName,
      lastName: creator.lastName,
      phone: creator.phone,
      email: creator.email,
      status: MemberStatus.ACTIVE,
      roles: [UserRole.MEMBER, UserRole.PRESIDENT],
      joinedAt: now,
      tourOrder: 1,
      hasReceivedTour: false,
      totalContributed: 0,
      totalArrears: 0,
    };
    db.members.push(creatorMember);

    // Créer un membre "invité" en attente pour chaque fondateur
    body.founders.forEach((founder, i) => {
      const memberId = `member-${db.members.length + 1}-${Date.now()}-${i}`;
      const [firstName, ...rest] = founder.fullName.trim().split(' ');
      const lastName = rest.join(' ') || '—';
      const roles =
        founder.role === 'MEMBER'
          ? [UserRole.MEMBER]
          : [UserRole.MEMBER, UserRole[founder.role]];
      const member: Member = {
        id: memberId,
        userId: `pending-${memberId}`,
        tontineId,
        matricule: `TC-${new Date().getFullYear()}-${String(db.members.length + 1).padStart(3, '0')}`,
        firstName,
        lastName,
        phone: founder.phone,
        email: founder.email,
        status: MemberStatus.PENDING,
        roles,
        joinedAt: now,
        tourOrder: 2 + i,
        hasReceivedTour: false,
        totalContributed: 0,
        totalArrears: 0,
      };
      db.members.push(member);
    });

    return HttpResponse.json(wrap(tontine, 'Tontine créée. Invitations envoyées aux fondateurs.'), {
      status: 201,
    });
  }),
];
