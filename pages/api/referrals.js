import { mockDashboardData } from "../../data/mockDashboardData";

export default function handler(req, res) {
  res.status(200).json(mockDashboardData.referrals);
}