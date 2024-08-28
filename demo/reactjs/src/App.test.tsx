import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App';

test('App rendered correctly', async () => {
  render(<App/>)
  const h2 = await screen.findByTestId('heading')
  expect(h2.textContent).toEqual('Welcome to Liquid')
})
