import { Link, useRouteError } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Whoops, algo deu errado...</h1>
      <p className="accent-accent-foreground">
        Aconteceu um erro na aplicação, abaixo você encontra mais detalhes{' '}
      </p>
      <pre>{error?.message || JSON.stringify(error)}</pre>
      <p className="text-accent-foreground">
        Voltar para o{' '}
        <Link to="/" className="text-primary">
          Dashboard
        </Link>
      </p>
    </div>
  )
}
