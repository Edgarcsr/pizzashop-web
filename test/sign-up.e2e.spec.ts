import { expect, test } from '@playwright/test'

test('sign up successfully', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Nome do estabelecimento' })
    .fill('Pizza Shop')
  await page.getByRole('textbox', { name: 'Seu nome' }).fill('John Doe')
  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('johndoe@email.com')
  await page.getByRole('textbox', { name: 'Seu celular' }).fill('11 90000-0000')

  await page.getByRole('button', { name: 'Finalizar Cadastro' }).click()

  const toast = page.getByText('Restaurante cadastrado com sucesso!')

  expect(toast).toBeVisible()
})

test('sign up with error', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Nome do estabelecimento' })
    .fill('Error')
  await page.getByRole('textbox', { name: 'Seu nome' }).fill('John Doe')
  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('johndoe@email.com')
  await page.getByRole('textbox', { name: 'Seu celular' }).fill('11 90000-0000')

  await page.getByRole('button', { name: 'Finalizar Cadastro' }).click()

  const toast = page.getByText('Erro ao cadastrar restaurante')
  expect(toast).toBeVisible()
})
