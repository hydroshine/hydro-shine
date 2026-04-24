import { Client, Environment } from "square";

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export async function POST(req) {
  const { name } = await req.json();

  const response = await client.checkoutApi.createPaymentLink({
    idempotencyKey: crypto.randomUUID(),
    quickPay: {
      name: "Hydro Shine Deposit",
      priceMoney: {
        amount: 2000, // £20
        currency: "GBP",
      },
      locationId: process.env.SQUARE_LOCATION_ID,
    },
  });

  return Response.json({
    url: response.result.paymentLink.url,
  });
}