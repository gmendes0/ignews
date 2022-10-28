import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import MockAdapter from "axios-mock-adapter";
import { SubscribeButton } from ".";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

/**
 * Caso eu faça mock do retorno aqui em cima,
 * eu nao consigo mudar o retorno nos testes depois com o mockReturnValueOnce
 */
jest.mock("next-auth/client");
jest.mock("next/dist/client/router");
jest.mock("../../services/stripe-js");

describe("SubscribeButtton component", () => {
  it("renders correctly", () => {
    /* MOCK useSession */

    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects to sign in if user is unauthenticated", () => {
    /* MOCK signIn */

    const signInMocked = jest.mocked(signIn);

    /* MOCK useSession */

    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts if user already has a subscription", () => {
    /* MOCK useSession */

    const useSessionMock = jest.mocked(useSession);

    useSessionMock.mockReturnValueOnce([
      {
        user: {
          email: "jhon.doe@gmail.com",
          name: "Jhon Doe",
          image: "fake-image",
        },
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },
      false,
    ]);

    /* MOCK useRouter */

    const useRouterMocked = jest.mocked(useRouter);

    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    /* RENDER */

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith("/posts");
  });

  it("calls stripe create session when user has not a subscription", async () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{ user: {} }, false]);

    const apiMock = new MockAdapter(api);

    apiMock.onPost("/stripe/sessions/create").replyOnce(200, {
      sessionId: "fake-session-id",
    });

    const redirectToCheckoutMocked = jest.fn();

    jest.mocked(getStripeJs).mockResolvedValueOnce({
      redirectToCheckout: redirectToCheckoutMocked,
    } as any);

    render(<SubscribeButton />);

    fireEvent.click(screen.getByText("Subscribe now"));

    waitFor(() => {
      expect(redirectToCheckoutMocked).toHaveBeenCalled();
    });
  });

  it("shows an alert when stripe create session throw an exception", () => {
    jest.mocked(useSession).mockReturnValueOnce([{ user: {} }, false]);

    const getStripeJsMocked = jest.fn();

    const apiMock = new MockAdapter(api);

    apiMock.onPost("/stripe/sessions/create").replyOnce(500, {});

    render(<SubscribeButton />);

    fireEvent.click(screen.getByRole("button", { name: /Subscribe now/ }));

    expect(getStripeJsMocked).not.toHaveBeenCalled();

    waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
