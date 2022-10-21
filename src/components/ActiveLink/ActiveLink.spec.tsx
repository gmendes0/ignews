import { render } from "@testing-library/react";
import ActiveLink from ".";

/**
 * Quando o módulo next/dist/client/router for chamado no teste
 * o mock irá faze-lo retornar o que foi definido na func do segundo param
 */
jest.mock("next/dist/client/router", () => {
  return {
    useRouter: () => {
      return {
        asPath: "/",
      };
    },
  };
});

/**
 * Quando temos vários testes do mesmo componente/funcionalidade podemos categoriza-los com o describe
 */
describe("ActiveLink component", () => {
  /**
   * Podemos usar it() ou test(), o it proporciona uma leitura mais humana pois parece que estamos escrevendo uma frase
   */
  it("should renders correctly", () => {
    /**
     * Gera o componente
     */
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/" passHref>
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("should add active class if its link is the current link", () => {
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/">
        <a>Home</a>
      </ActiveLink>
    );

    /**
     * Como no mock o useRouter esta com o o obj {asPath: '/'} entao o link vai ser ativo
     */
    expect(getByText("Home")).toHaveClass("active");
  });

  it("souldn't add active class if its link isn't the current link", () => {
    const { getByText } = render(
      <ActiveLink activeClassName="active" href="/home">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).not.toHaveClass("active");
  });
});
