import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next-auth/client", () => ({
  useSession: () => [null, false],
}));

jest.mock("next/dist/client/router");

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceID: "fake-price-id", amount: "$10.00" }} />);

    expect(screen.getByText("for $10.00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const stripePricesRetrieveMocked = jest.mocked(stripe.prices.retrieve);

    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: "fake-id",
      unit_amount: 1000, // valor em centavos assim como é retornado na api real
    } as any); // Como a funçao retorna uma promise, o resolved vai retornar o valor em si

    const staticPropsResponse = await getStaticProps({}); // chama o getStaticProps da pagina home

    expect(staticPropsResponse).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceID: "fake-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
