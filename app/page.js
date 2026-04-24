"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function HydroShineApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <BookingRevenueUI />
    </div>
  );
}

// ---------------- REVENUE-OPTIMISED BOOKING UI ----------------
function BookingRevenueUI() {
  const [form, setForm] = useState({
    size: "",
    service: "",
    condition: "light",
    addons: {},
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = ["09:00", "11:30", "14:00", "16:30"];

  // --- PRICING TABLES ---
  const basePrices = {
    small: { exterior: 25, interior: 45, full: 70 },
    medium: { exterior: 30, interior: 55, full: 85 },
    large: { exterior: 40, interior: 65, full: 100 },
  };

  const conditionFees = {
    light: 0,
    moderate: 10,
    heavy: 20,
  };

  const addonList = [
    { key: "pet", label: "Pet Hair Removal", price: 15 },
    { key: "stain", label: "Deep Stain Removal", price: 20 },
    { key: "engine", label: "Engine Bay Clean", price: 20 },
    { key: "odour", label: "Odour Treatment", price: 15 },
  ];

  // --- PRICE CALCULATION ---
  const price = useMemo(() => {
    if (!form.size || !form.service) return 0;

    const base = basePrices[form.size]?.[form.service] || 0;
    const condition = conditionFees[form.condition] || 0;

    const addonsTotal = addonList.reduce((sum, a) => {
      return form.addons[a.key] ? sum + a.price : sum;
    }, 0);

    return base + condition + addonsTotal;
  }, [form]);

  const toggleAddon = (key) => {
    setForm((prev) => ({
      ...prev,
      addons: { ...prev.addons, [key]: !prev.addons[key] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalPrice: price,
        deposit: 20,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Book Hydro Shine</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required />

            {/* VEHICLE SIZE */}
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full p-2 rounded text-black"
              required
            >
              <option value="">Vehicle Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            {/* SERVICE */}
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full p-2 rounded text-black"
              required
            >
              <option value="">Service</option>
              <option value="exterior">Exterior Wash</option>
              <option value="interior">Interior Clean</option>
              <option value="full">Full Detail</option>
            </select>

            {/* CONDITION */}
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full p-2 rounded text-black"
            >
              <option value="light">Light Condition</option>
              <option value="moderate">Moderate (+£10)</option>
              <option value="heavy">Heavy (+£20)</option>
            </select>

            {/* ADDONS */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Add-ons</p>
              {addonList.map((a) => (
                <label key={a.key} className="flex justify-between items-center text-sm">
                  <span>{a.label}</span>
                  <div className="flex items-center gap-2">
                    <span>£{a.price}</span>
                    <input
                      type="checkbox"
                      checked={!!form.addons[a.key]}
                      onChange={() => toggleAddon(a.key)}
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* DATE/TIME */}
            <Input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} required />

            <select
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full p-2 rounded text-black"
              required
            >
              <option value="">Time Slot</option>
              {timeSlots.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            {/* PRICE DISPLAY */}
            <div className="bg-gray-800 p-4 rounded text-center">
              <p className="text-sm text-gray-400">Total Price</p>
              <p className="text-2xl font-bold">£{price}</p>
              <p className="text-xs text-gray-400">£20 deposit paid now</p>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Pay £20 Deposit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
