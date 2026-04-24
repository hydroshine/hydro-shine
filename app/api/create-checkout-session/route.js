export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const locationId = process.env.SQUARE_LOCATION_ID;
    const token = process.env.SQUARE_ACCESS_TOKEN;

    const res = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        quick_pay: {
          name: "Hydro Shine Deposit",
          price_money: {
            amount: 2000,
            currency: "GBP",
          },
          location_id: locationId,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return Response.json({
      url: data.payment_link.url,
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Payment failed" },
      { status: 500 }
    );
  }
}