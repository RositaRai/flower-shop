"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

type Report = {
  id: number;
  report_date: string;
  bouquets_sold: number;
  revenue: string | number;
  created_at: string;
};

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        setReports(data.data ?? []);
        setLoading(false);
      });
  }, []);

  const totalBouquets = reports.reduce((sum, r) => sum + Number(r.bouquets_sold), 0);
  const totalRevenue = reports.reduce((sum, r) => sum + Number(r.revenue), 0);

  return (
    <>
      <Header />
      <main className="reports-page">
        <div className="report-header">
          <div>
            <p className="eyebrow">PARDAVIMŲ ANALITIKA</p>
            <h1>Pardavimų ataskaitos</h1>
            <p className="muted">
              Ataskaitą kiekvieną vakarą automatiškai sukuria background job.
            </p>
          </div>
          <Link href="/" className="button">← Puokštės</Link>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Viso parduota</span>
            <strong>{totalBouquets}</strong>
            <small>puokščių</small>
          </div>
          <div className="stat-card">
            <span>Visos pajamos</span>
            <strong>{totalRevenue.toFixed(2)} €</strong>
            <small>pagal sugeneruotas ataskaitas</small>
          </div>
        </div>

        <section className="report-table">
          <div className="report-row report-head">
            <span>Data</span>
            <span>Parduota</span>
            <span>Pajamos</span>
          </div>

          {loading ? (
            <p className="center">Kraunama...</p>
          ) : reports.length === 0 ? (
            <div className="empty">
              <h3>Ataskaitų dar nėra</h3>
              <p>Jos atsiras po pirmojo background job paleidimo.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div className="report-row" key={report.id}>
                <strong>
                  {report.report_date.split("T")[0]}
                </strong>
                <span>{report.bouquets_sold} puokštės</span>
                <strong>{Number(report.revenue).toFixed(2)} €</strong>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}