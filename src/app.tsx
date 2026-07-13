import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import HomePage from "@/pages/HomePage/HomePage";
import RiskAssessmentPage from "@/pages/RiskAssessmentPage/RiskAssessmentPage";
import CalculatorPage from "@/pages/CalculatorPage/CalculatorPage";
import BacktestPage from "@/pages/BacktestPage/BacktestPage";
import ResearchPage from "@/pages/ResearchPage/ResearchPage";
import ResearchReportsPage from "@/pages/ResearchReportsPage/ResearchReportsPage";
import ContactPage from "@/pages/ContactPage/ContactPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="risk-assessment" element={<RiskAssessmentPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="backtest" element={<BacktestPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="reports" element={<ResearchReportsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
