import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton component", () => {
  it("should renders correctly when user is unauthenticated", () => {
    const mockedUseSession = jest.mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false]); // mock apenas do proximo retorno

    render(<SignInButton />);

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("should render correctly when user is authenticated", () => {
    const mockedUseSession = jest.mocked(useSession);

    mockedUseSession.mockReturnValueOnce([
      {
        user: { email: "jhon.doe@gmail.com", name: "Jhon Doe", image: "" },
        expires: "expires",
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText("Jhon Doe")).toBeInTheDocument();
  });
});
