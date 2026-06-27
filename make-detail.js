import fs from 'fs';

const modalCode = fs.readFileSync('modal.tsx', 'utf8');

// We wrap it in a functional component.
const componentCode = `import React, { useState, useEffect } from "react";
import { ArrowLeft, MoreVertical, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../utils/AppContext";
import { useMarketSimulation } from "../utils/MarketSimulationContext";
import { calculateLiveProfit as globalCalculateLiveProfit } from "../utils/profitCalculator";
import { formatINR } from "../utils/mockData";
import { MobilePortfolioSummary } from "./MobilePortfolioSummary";
import { SwipeButton } from "./SwipeButton";

export function LivePortfolioDetail({ selectedInvestment, onClose, onBuyClick }: any) {
  const { state, dispatch } = useAppContext();
  const { marketState } = useMarketSimulation();
  
  const [selectedInvestmentIds, setSelectedInvestmentIds] = useState<string[]>(
    selectedInvestment?.groupedInvestmentsList?.map((i: any) => i.id) || []
  );
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [withdrawFormData, setWithdrawFormData] = useState({
    completedMonths: selectedInvestment?.timePeriodMonths?.toString() || "12",
    rmasCommission: "0.00",
    happyIncomeTax: "0.00"
  });
  const [showTradeOptions, setShowTradeOptions] = useState(false);
  
  const setSelectedInvestment = (val: any) => {
    if (!val) onClose();
  };

  useEffect(() => {
    if (selectedInvestment) {
      setSelectedInvestmentIds(selectedInvestment.groupedInvestmentsList.map((i: any) => i.id));
      setWithdrawStep(0);
    }
  }, [selectedInvestment]);

  // Inject modalCode
  return (
    ${modalCode.replace(/\{selectedInvestment &&\s*\(\(\) => \{/g, '(() => {').replace(/\}\)\(\)\}/g, '})()')}
  );
}
`;

fs.writeFileSync('src/components/LivePortfolioDetail.tsx', componentCode);
console.log('Created src/components/LivePortfolioDetail.tsx');
