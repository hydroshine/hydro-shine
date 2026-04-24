"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  // ✅ Load bookings from real database
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setBookings(data || []);
  };

  // Run on page load
  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Mark job complete (REAL database update)
  const completeJob = async (id) => {
    await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", id);

    fetchBookings();
  };

  // Daily limit logic (4 jobs/day)
  const todayJobs = bookings.filter(
    (b) => b.date === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hydro Shine Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-400">Total Bookings</p>
            <h2 className="text-2xl font-bold">{bookings.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-400">Today's Jobs</p>
            <h2 className="text-2xl font-bold">
              {todayJobs.length}/4
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-400">Revenue</p>
            <h2 className="text-2xl font-bold">
              £{bookings.reduce((sum, b) => sum + (b.price || 0), 0)}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {bookings.length === 0 && (
          <p className="text-gray-400">No bookings yet</p>
        )}

        {bookings.map((booking) => (
          <Card key={booking.id} className="bg-gray-900">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{booking.name}</h3>
                <p className="text-sm text-gray-400">
                  {booking.car_size} • {booking.date}
                </p>
                <p className="text-sm">£{booking.price}</p>
              </div>

              <div className="flex gap-2 items-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    booking.status === "completed"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {booking.status}
                </span>

                {booking.status !== "completed" && (
                  <Button onClick={() => completeJob(booking.id)}>
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}