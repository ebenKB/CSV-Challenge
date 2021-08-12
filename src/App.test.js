import { render, screen } from '@testing-library/react';
import App from './App';

describe("<App />" , () => {
  let wrapper = null
  test("Renders a wrapping div", () => {
    wrapper = render(<App />);
    const ele = screen.getByTestId("wrapper")
    expect(ele).type="div";
  })

  test("Has a form", () => {
    wrapper = render(<App />)
    const form = screen.getByTestId("form")
    expect(form).type="form"
  });

  test("It matches the current snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  })
})