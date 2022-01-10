import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../../../services/faunadb";
import { stripe } from "../../../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case "POST":
      const session = await getSession({ req: request });

      if (!session || !session.user || !session.user.email)
        return response.status(401).end("Unauthorized");

      const user = await fauna.query<User>(
        q.Get(
          q.Match(q.Index("users_by_email"), q.Casefold(session.user.email))
        )
      );

      let customerID = user.data.stripe_customer_id;

      if (!customerID) {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email,
          // metadata:
        });

        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), user.ref.id), {
            data: {
              stripe_customer_id: stripeCustomer.id,
            },
          })
        );

        customerID = stripeCustomer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        success_url:
          process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/posts",
        cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/",
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        mode: "subscription",
        payment_method_types: ["card"],
        billing_address_collection: "required",
        allow_promotion_codes: true,
        customer: customerID,
      });

      return response.status(201).json({ sessionId: stripeCheckoutSession.id });
      break;

    default:
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
      break;
  }
}
