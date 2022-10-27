import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

describe("Async component", () => {
  it("renders hello world ", () => {
    render(<Async />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("shows a button", async () => {
    render(<Async />);

    // todos os get... tem um find...
    // o findByText espera o elemento aparecer na tela
    // possui um timeout padrao, mas pode ser passado um customizado: await screen.findByText("Button", {}, { timeout: 3000 })
    /* expect(await screen.findByText("Button")).toBeInTheDocument(); */

    // assim como os finds, o waitFor tenta fazer o assert até que de sucesso
    // é possível passar um obj no segundo param com timout, tempo entre tentativas, etc
    // deve retornar um expect
    await waitFor(() => {
      return expect(screen.getByText("Button")).toBeInTheDocument();
    });
  });

  it("hides the loading element after a while", async () => {
    render(<Async />);

    // await waitFor(() => {
    //   // O query... funciona assim como o get... mas ao invés de lançar uma exception ele apenas retorna null se o elemento nao for encontrado
    //   // https://testing-library.com/docs/queries/about
    //   // é possível fazer essa verificacao com waitFor e o not.totoBeInTheDocument, mas é possível fazer isso com o waitForElementToBeRemoved
    //   return expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    // });

    // O query... funciona assim como o get... mas ao invés de lançar uma exception ele apenas retorna null se o elemento nao for encontrado
    // https://testing-library.com/docs/queries/about
    await waitForElementToBeRemoved(screen.queryByText("Loading..."), {
      timeout: 3000,
    });
  });
});
