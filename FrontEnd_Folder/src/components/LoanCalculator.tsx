import { useState } from 'react';
import { Calculator, TrendingUp, Award, Shield, Heart } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { config } from '../config';

const BASE_URL = config.apiUrl;

interface LoanOption {
  program: string;
  apr_percent: number;
  down_required: number;
  monthly_payment: number;
  total_paid: number;
  price_used?: number;
}

interface LoanData {
  standard: LoanOption;
  special_programs: {
    student: LoanOption;
    military: LoanOption;
    elderly: LoanOption;
  };
}

export function LoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState('35000');
  const [loanTerm, setLoanTerm] = useState('60');
  const [creditScore, setCreditScore] = useState('700');
  const [customerType, setCustomerType] = useState<'standard' | 'student' | 'military' | 'elderly'>('standard');
  const [loanData, setLoanData] = useState<LoanData | null>(null);

  const calculateLoan = async () => {
    try {
      const price = parseFloat(vehiclePrice);
      const term = parseFloat(loanTerm);
      const credit = parseFloat(creditScore);

      const response = await fetch(
        `${BASE_URL}/loan?price=${price}&credit_score=${credit}&months=${term}`
      );
      const data = await response.json();

      setLoanData(data);
    } catch (error) {
      console.error('Error calculating loan:', error);
    }
  };

  const getSelectedLoan = (): LoanOption | null => {
    if (!loanData) return null;
    if (customerType === 'standard') return loanData.standard;
    return loanData.special_programs[customerType];
  };

  const selectedLoan = getSelectedLoan();

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
          <Label htmlFor="credit-score" className="text-purple-200">Credit Score</Label>
          <Input
            id="credit-score"
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            className="bg-white/20 border-purple-300/50 text-white"
            placeholder="300-850"
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

        <div>
          <Label htmlFor="customer-type" className="text-purple-200">Customer Type</Label>
          <Select value={customerType} onValueChange={(value: any) => setCustomerType(value)}>
            <SelectTrigger id="customer-type" className="bg-white/20 border-purple-300/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Finance</SelectItem>
              <SelectItem value="student">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Student / College Grad
                </div>
              </SelectItem>
              <SelectItem value="military">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Military / Veteran
                </div>
              </SelectItem>
              <SelectItem value="elderly">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Senior Citizen
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={calculateLoan}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 shadow-lg shadow-blue-500/50"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Loan Payment
        </Button>

        {selectedLoan && (
          <div className="mt-6 space-y-4">
            {/* Selected Program Display */}
            <div className="p-6 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg border border-blue-300/50">
              <div className="flex items-center justify-between mb-4">
                <div className="text-purple-200 text-sm">Selected Program</div>
                {customerType !== 'standard' && (
                  <Badge className="bg-green-600/50 text-white border-green-300/50">
                    Special Rate
                  </Badge>
                )}
              </div>
              <div className="text-lg font-semibold text-white mb-3">{selectedLoan.program}</div>
              
              <div className="text-purple-200 mb-2">Estimated Monthly Payment</div>
              <div className="text-4xl font-bold mb-4">${selectedLoan.monthly_payment.toFixed(2)}</div>
              
              <div className="space-y-2 border-t border-purple-300/30 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">APR:</span>
                  <span className="text-white font-semibold">{selectedLoan.apr_percent.toFixed(2)}%</span>
                </div>
                {selectedLoan.down_required > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Down Payment Required:</span>
                    <span className="text-white font-semibold">${selectedLoan.down_required.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Total Amount Paid:</span>
                  <span className="text-white font-semibold">${selectedLoan.total_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Total Interest:</span>
                  <span className="text-white font-semibold">
                    ${(selectedLoan.total_paid - (parseFloat(vehiclePrice) - selectedLoan.down_required)).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-purple-300 mt-4">
                * This is an estimate. Actual payments may vary.
              </div>
            </div>

            {/* Show other available programs */}
            {loanData && customerType === 'standard' && (
              <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-300/30">
                <div className="text-sm font-semibold text-purple-200 mb-3">Special Programs Available:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-blue-300" />
                      <span className="text-purple-200">Student/College Grad</span>
                    </div>
                    <span className="text-white font-semibold">
                      {loanData.special_programs.student.apr_percent.toFixed(2)}% APR
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-300" />
                      <span className="text-purple-200">Military/Veteran</span>
                    </div>
                    <span className="text-white font-semibold">
                      {loanData.special_programs.military.apr_percent.toFixed(2)}% APR
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-pink-300" />
                      <span className="text-purple-200">Senior Citizen</span>
                    </div>
                    <span className="text-white font-semibold">
                      {loanData.special_programs.elderly.apr_percent.toFixed(2)}% APR
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
