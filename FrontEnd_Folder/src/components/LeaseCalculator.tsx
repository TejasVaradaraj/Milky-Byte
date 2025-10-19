import { useState } from 'react';
import { Calculator, TrendingDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { config } from '../config';

const BASE_URL = config.apiUrl;

export function LeaseCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState('35000');
  const [downPayment, setDownPayment] = useState('3000');
  const [leaseTerm, setLeaseTerm] = useState('36');
  const [creditScore, setCreditScore] = useState('700');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [aprPercent, setAprPercent] = useState<number | null>(null);
  const [calculatedResidual, setCalculatedResidual] = useState<number | null>(null);

  const calculateLease = async () => {
    try {
      const price = parseFloat(vehiclePrice);
      const down = parseFloat(downPayment);
      const term = parseFloat(leaseTerm);
      const credit = parseFloat(creditScore);

      const response = await fetch(
        `${BASE_URL}/lease?price=${price}&credit_score=${credit}&months=${term}&downpayment=${down}`
      );
      const data = await response.json();

      setMonthlyPayment(data.monthly_lease);
      setAprPercent(data.apr_percent);
      setCalculatedResidual(data.residual_value);
    } catch (error) {
      console.error('Error calculating lease:', error);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingDown className="w-6 h-6 text-purple-300" />
          Lease Calculator
        </CardTitle>
        <p className="text-purple-200">Calculate your estimated monthly lease payment</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="lease-price" className="text-purple-200">Vehicle Price ($)</Label>
          <Input
            id="lease-price"
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <div>
          <Label htmlFor="lease-down" className="text-purple-200">Down Payment ($)</Label>
          <Input
            id="lease-down"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>

        <div>
          <Label htmlFor="lease-term" className="text-purple-200">Lease Term (months)</Label>
          <Input
            id="lease-term"
            type="number"
            value={leaseTerm}
            onChange={(e) => setLeaseTerm(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
          />
        </div>


        <div>
          <Label htmlFor="lease-credit-score" className="text-purple-200">Credit Score</Label>
          <Input
            id="lease-credit-score"
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
            placeholder="300-850"
          />
        </div>

        <Button 
          onClick={calculateLease}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 shadow-lg shadow-purple-500/50"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Lease Payment
        </Button>

        {monthlyPayment !== null && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg border border-purple-300/50">
            <div className="text-purple-200 mb-2">Estimated Monthly Payment</div>
            <div className="text-4xl">${monthlyPayment.toFixed(2)}</div>
            {aprPercent !== null && (
              <div className="text-sm text-purple-300 mt-3">
                APR: {aprPercent.toFixed(2)}%
              </div>
            )}
            {calculatedResidual !== null && (
              <div className="text-sm text-purple-300 mt-1">
                Residual Value: ${calculatedResidual.toFixed(2)}
              </div>
            )}
            <div className="text-sm text-purple-300 mt-2">
              * This is an estimate. Actual payments may vary.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
