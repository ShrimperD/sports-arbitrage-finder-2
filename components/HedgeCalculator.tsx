import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HedgeCalculatorProps {
  odds1: number;
  odds2: number;
  totalStake: number;
}

export function HedgeCalculator({ odds1, odds2, totalStake }: HedgeCalculatorProps) {
  const [stake1, setStake1] = useState(totalStake / 2);
  const [stake2, setStake2] = useState(totalStake / 2);

  const calculateHedge = () => {
    // Calculate optimal stakes for equal profit
    const total = odds1 * odds2;
    const stake1 = (totalStake * odds2) / (odds1 + odds2);
    const stake2 = totalStake - stake1;
    
    setStake1(stake1);
    setStake2(stake2);
  };

  const profit1 = (stake1 * odds1) - totalStake;
  const profit2 = (stake2 * odds2) - totalStake;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hedge Calculator</CardTitle>
        <CardDescription>Calculate optimal bet amounts for equal profit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bet 1 Amount</Label>
            <Input
              type="number"
              value={stake1.toFixed(2)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newStake1 = parseFloat(e.target.value);
                setStake1(newStake1);
                setStake2(totalStake - newStake1);
              }}
            />
            <p className="text-sm text-muted-foreground">
              Odds: {odds1.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Potential Profit: ${profit1.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Bet 2 Amount</Label>
            <Input
              type="number"
              value={stake2.toFixed(2)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newStake2 = parseFloat(e.target.value);
                setStake2(newStake2);
                setStake1(totalStake - newStake2);
              }}
            />
            <p className="text-sm text-muted-foreground">
              Odds: {odds2.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Potential Profit: ${profit2.toFixed(2)}
            </p>
          </div>
        </div>
        <Button onClick={calculateHedge} className="w-full">
          Calculate Optimal Hedge
        </Button>
      </CardContent>
    </Card>
  );
} 