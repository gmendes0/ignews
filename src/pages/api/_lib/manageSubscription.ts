import { query as q } from "faunadb";
import { fauna } from "../../../services/faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction: boolean = false
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("users_by_stripe_customer_ids"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    user_id: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.If(
        q.Not(
          q.Exists(q.Match(q.Index("subscriptions_by_id"), subscription.id))
        ),
        q.Create(q.Collection("subscriptions"), {
          data: subscriptionData,
        }),
        null
      )
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscriptions_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
