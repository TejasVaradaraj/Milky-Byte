import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

export function LoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState('35000');
  const [downPayment, setDownPayment] = useState('7000');
  const [interestRate, setInterestRate] = useState('5.5');
  const [loanTerm, setLoanTerm] = useState('60');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm);

    const principal = price - down;
    const monthly = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const total = monthly * term;
    const interest = total - principal;

    setMonthlyPayment(monthly);
    setTotalInterest(interest);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="w-6 h-6 text-blue-300" />
          Loan Calculator
        </CardTitle>
        <p className="text-purple-200">Calculate your estimated monthly loan payment</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="loan-price" className="text-purple-200">Vehicle Price ($)</Label>
          <Input
            id="loan-price"
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <div>
          <Label htmlFor="loan-down" className="text-purple-200">Down Payment ($)</Label>
          <Input
            id="loan-down"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <div>
          <Label htmlFor="interest-rate" className="text-purple-200">Interest Rate (%)</Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <div>
          <Label htmlFor="loan-term" className="text-purple-200">Loan Term (months)</Label>
          <Input
            id="loan-term"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <Button 
          onClick={calculateLoan}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 shadow-lg shadow-blue-500/50"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Loan Payment
        </Button>

        {monthlyPayment !== null && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg border border-blue-300/50">
            <div className="text-purple-200 mb-2">Estimated Monthly Payment</div>
            <div className="text-4xl">${monthlyPayment.toFixed(2)}</div>
            {totalInterest !== null && (
              <div className="text-sm text-purple-300 mt-3">
                Total Interest: ${totalInterest.toFixed(2)}
              </div>
            )}
            <div className="text-sm text-purple-300 mt-1">
              * This is an estimate. Actual payments may vary.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
