import { render, screen } from "@testing-library/react";

import { SearchForm } from "./CredentialSearchForm";

describe("<SearchForm /> unit test", () => {
  test('h2要素として描画されている"検索"の文字列が存在する', () => {
    const { container } = render(<SearchForm />);
    const h2Element = container.querySelector("h2");
    expect(h2Element).toHaveTextContent("検索");
  });

  test("SearchFormコンポーネントが正常にレンダリングされる", () => {
    render(<SearchForm />);
    expect(screen.getByLabelText("バッジ名")).toBeInTheDocument();
    expect(screen.getByLabelText("発行日From")).toBeInTheDocument();
    expect(screen.getByLabelText("発行日To")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "発行日（新しい順）" })).toBeInTheDocument();
  });
});
