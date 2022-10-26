import { render, screen, fireEvent } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { NextRouter, useRouter } from "next/dist/client/router";
import { SubscribeButton } from ".";

/**
 * Caso eu faça mock do retorno aqui em cima,
 * eu nao consigo mudar o retorno nos testes depois com o mockReturnValueOnce
 */
jest.mock("next-auth/client");

jest.mock("next/dist/client/router");

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
});
