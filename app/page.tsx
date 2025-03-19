'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { HedgeCalculator } from '@/components/HedgeCalculator';
import { fetchArbitrageOpportunities } from '@/lib/api';
import type { ArbitrageOpportunity } from '@/types/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortOption = 'date' | 'profit';

export default function Home() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [minReturn, setMinReturn] = useState(25);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArbitrageOpportunities();
      setOpportunities(data);
    } catch (err) {
      setError('Failed to fetch opportunities');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filteredAndSortedOpportunities = opportunities
    .filter(opportunity => opportunity.totalReturn >= minReturn)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime();
      } else {
        return b.totalReturn - a.totalReturn;
      }
    });

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Arbitrage Opportunities</CardTitle>
                <CardDescription>Find profitable betting opportunities across different bookmakers</CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchOpportunities}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="minReturn">Minimum Return (%)</Label>
                  <Input
                    id="minReturn"
                    type="number"
                    value={minReturn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinReturn(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>
                <div className="flex-1">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="profit">Profit %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredAndSortedOpportunities.map((opportunity) => (
                    <Card 
                      key={opportunity.id} 
                      className={`hover:bg-accent transition-colors cursor-pointer ${
                        selectedOpportunity?.id === opportunity.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedOpportunity(opportunity)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{opportunity.homeTeam} vs {opportunity.awayTeam}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(opportunity.commenceTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              Return: {opportunity.totalReturn.toFixed(2)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {opportunity.sportTitle}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {opportunity.bets.map((bet, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{bet.team}</span>
                              <span className="text-muted-foreground">
                                {bet.bookmaker} - ${bet.stake.toFixed(2)} @ {bet.odds.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div>
          {selectedOpportunity && selectedOpportunity.bets.length === 2 && (
            <HedgeCalculator
              odds1={selectedOpportunity.bets[0].odds}
              odds2={selectedOpportunity.bets[1].odds}
              totalStake={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}