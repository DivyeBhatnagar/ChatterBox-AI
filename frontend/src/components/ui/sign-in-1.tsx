import * as React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  logoSrc?: string
  logoAlt?: string
  title: string
  description?: string
  primaryAction?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    loading?: boolean
  }
  footerContent?: React.ReactNode
  children?: React.ReactNode
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = 'Company Logo',
      title,
      description,
      primaryAction,
      footerContent,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <Card
          ref={ref}
          className={cn(
            'w-full max-w-md border-zinc-700/60 bg-[#10131d]/80 backdrop-blur-xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500',
          )}
          {...props}
        >
          <CardHeader className="text-center">
            {logoSrc ? (
              <div className="mb-4 flex justify-center">
                <img src={logoSrc} alt={logoAlt} className="h-12 w-12 rounded-[4px] object-contain" />
              </div>
            ) : null}
            <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-100">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="grid gap-4">
            {primaryAction ? (
              <Button
                onClick={primaryAction.onClick}
                className="w-full transition-transform hover:scale-[1.01]"
                disabled={primaryAction.loading}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            ) : null}
            {children}
          </CardContent>
          {footerContent ? (
            <CardFooter className="flex flex-col text-center text-sm text-zinc-400">{footerContent}</CardFooter>
          ) : null}
        </Card>
      </div>
    )
  },
)
AuthForm.displayName = 'AuthForm'

export { AuthForm }
