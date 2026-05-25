import type { LoanSimulation, LoanSimulationRow } from '../../../shared/models/entities/loan.model';

export interface SimulationInput {
  principal: number;
  annualInterestRate: number;
  durationMonths: number;
}

export const simulateLoan = ({
  principal,
  annualInterestRate,
  durationMonths,
}: SimulationInput): LoanSimulation => {
  if (principal <= 0 || durationMonths <= 0) {
    return {
      principal,
      interestRate: annualInterestRate,
      durationMonths,
      monthlyPayment: 0,
      totalInterest: 0,
      totalDue: 0,
      schedule: [],
    };
  }

  const monthlyRate = annualInterestRate / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / durationMonths
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -durationMonths));

  const schedule: LoanSimulationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= durationMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPart = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      month,
      principal: Math.round(principalPart),
      interest: Math.round(interest),
      payment: Math.round(monthlyPayment),
      remainingBalance: Math.round(balance),
    });
  }

  const totalDue = monthlyPayment * durationMonths;

  return {
    principal,
    interestRate: annualInterestRate,
    durationMonths,
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalDue - principal),
    totalDue: Math.round(totalDue),
    schedule,
  };
};
