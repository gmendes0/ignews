import { render, screen } from "@testing-library/react";
import { Header } from ".";

jest.mock("next/dist/client/router", () => ({
  useRouter: () => ({
    asPath: "/",
  }),
}));

/**
 * como o Header chama o SignInButton que chama o useSession, vamos mocka-lo também
 */
jest.mock("next-auth/client", () => ({
  useSession: () => [null, false],
}));

describe("Header component", () => {
  it("should renders correctly", () => {
    // const { getByText } = render(<Header />);

    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
