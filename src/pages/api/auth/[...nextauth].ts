import { query as q } from "faunadb";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { fauna } from "../../../services/faunadb";

export default NextAuth({
  // jwt: {
  //   signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  // },
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  callbacks: {
    session: async (session) => {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscriptions_by_user_id"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("users_by_email"),
                      q.Casefold(session.user?.email ?? "")
                    )
                  )
                )
              ),
              q.Match(q.Index("subscriptions_by_status"), "active"),
            ])
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch (error) {
        return { ...session, activeSubscription: null };
      }
    },

    signIn: async (user, account, profile) => {
      const { email } = user;

      try {
        if (!email) throw new Error("Unable to get email");

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("users_by_email"), q.Casefold(email || ""))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("users_by_email"), q.Casefold(email || "")))
          )
        );
      } catch (err) {
        console.error(err);

        return false;
      }

      return true;
    },
  },
});
