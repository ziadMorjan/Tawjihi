/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";
import axios from "axios";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import reportsBarChartData from "../dashboard/data/reportsBarChartData";
import reportsLineChartData from "../dashboard/data/reportsLineChartData";

import { API_URL } from "../../../config";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    lessons: 0,
    paymentsTotal: 0,
    paymentsCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [studentsRes, teachersRes, coursesRes, lessonsRes, paymentsRes] = await Promise.all([
          axios.get(`${API_URL}/users?role=user`, { withCredentials: true }),
          axios.get(`${API_URL}/users?role=teacher`, { withCredentials: true }),
          axios.get(`${API_URL}/courses`, { withCredentials: true }),
          axios.get(`${API_URL}/lessons`, { withCredentials: true }),
          axios.get(`${API_URL}/payment`, { withCredentials: true }),
        ]);

        const payments = paymentsRes?.data?.data?.docs || [];
        const paymentsTotal = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        setStats({
          students: studentsRes?.data?.data?.docs?.length || 0,
          teachers: teachersRes?.data?.data?.docs?.length || 0,
          courses: coursesRes?.data?.data?.docs?.length || 0,
          lessons: lessonsRes?.data?.data?.docs?.length || 0,
          paymentsTotal,
          paymentsCount: payments.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "الطلاب", icon: "groups", color: "info", value: stats.students },
    { title: "المعلمين", icon: "school", color: "success", value: stats.teachers },
    { title: "الدورات", icon: "menu_book", color: "primary", value: stats.courses },
    { title: "الدروس", icon: "movie", color: "warning", value: stats.lessons },
    { title: "عدد المدفوعات", icon: "receipt_long", color: "secondary", value: stats.paymentsCount },
    { title: "إجمالي الإيرادات", icon: "payments", color: "dark", value: `${stats.paymentsTotal} ₪` },
  ];

  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={6} lg={4} key={card.title}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color={card.color}
                  icon={card.icon}
                  title={card.title}
                  count={loading ? "..." : card.value}
                  percentage={{ color: "success", amount: "", label: "تم التحديث" }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsBarChart
              color="info"
              title="نمو المستخدمين"
              description="اتجاه تسجيلات المستخدمين"
              date="آخر تحديث"
              chart={reportsBarChartData}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsLineChart
              color="success"
              title="مبيعات يومية"
              description="نسبة تغير الإيرادات اليومية"
              date="آخر تحديث"
              chart={sales}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsLineChart
              color="dark"
              title="مهام مكتملة"
              description="مؤشر إنجاز العمل"
              date="آخر تحديث"
              chart={tasks}
            />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
