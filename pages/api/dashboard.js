import { mockDashboardData } from "../../data/mockDashboardData";

export default function handler(req, res) {
  res.status(200).json({
    sales: mockDashboardData.sales,
    referrals: mockDashboardData.referrals,
    payouts: mockDashboardData.payouts,
  });
}