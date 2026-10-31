import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { FaHome } from 'react-icons/fa'

import { MobileDrawer } from '../MobileDrawer'
import { SC } from '../scheme'

describe('MobileDrawer', () => {
  it('renders the mobile navigation and closes when a link is selected', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <MobileDrawer
          logoSrc="/logo.svg"
          navItems={[{ label: 'Inicio', href: '/', icon: FaHome }]}
          open
          sc={SC.white}
          siteTitle="Seguimiento"
          onClose={onClose}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('dialog', { name: 'Menú de navegación' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /inicio/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('runs login and logout actions and then closes the drawer', async () => {
    const onClose = vi.fn()
    const onLogin = vi.fn()
    const onLogout = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <MobileDrawer
          logoSrc="/logo.svg"
          navItems={[]}
          onClose={onClose}
          onLogin={onLogin}
          onLogout={onLogout}
          open
          sc={SC.white}
          user={{ name: 'Ada Lovelace', email: 'ada@example.test' }}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(onLogin).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
