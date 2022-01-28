import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../../services/stripe";
import { saveSubscription } from "../_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case "POST":
      const buf = await buffer(request);

      const secret = request.headers["stripe-signature"];

      let event: Stripe.Event;

      try {
        if (!process.env.STRIPE_WEBHOOK_SECRET)
          throw new Error("secret not found");

        event = stripe.webhooks.constructEvent(
          buf.toString(),
          secret,
          process.env.STRIPE_WEBHOOK_SECRET,
          Number(process.env.STRIPE_WEBHOOK_TOLERANCE) || 300
        );
      } catch (err: any) {
        console.error(err);
        return response.status(400).send(`Webhook error: ${err.message}`);
      }

      const { type } = event;

      if (relevantEvents.has(type)) {
        try {
          switch (type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
              const subscription = event.data.object as Stripe.Subscription;

              await saveSubscription(
                subscription.id.toString(),
                subscription.customer.toString(),
                type === "customer.subscription.created"
              );

              break;
            case "checkout.session.completed":
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;

              if (!checkoutSession.subscription)
                throw new Error("Undefined subscription ID.");

              if (!checkoutSession.customer)
                throw new Error("Undefined customer ID");

              await saveSubscription(
                checkoutSession.subscription?.toString(),
                checkoutSession.customer?.toString(),
                true
              );

              break;
            default:
              throw new Error("Unhandled event.");
          }
        } catch (error) {
          response.json({ error: "Webhook handler failed." });
        }
      }

      return response.json({ msg: "ok" });
      break;
    default:
      response.setHeader("Allow", "POST");
      return response.status(405).end("Method not allowed");
      break;
  }
}
