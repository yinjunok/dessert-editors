import React, { FC } from 'react'
import clsx from 'clsx'

export type ButtonProps = {
  icon?: React.ReactNode
  isActive?: boolean
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<ButtonProps> = ({ icon, isActive, className, children, ...props }) => {
  return (
    <button
      className={clsx(
        'hover:bg-slate-100 active:bg-slate-200 px-1 py-1 rounded transition-all whitespace-nowrap inline-flex items-center gap-1',
        isActive ? 'text-stone-900' : 'text-stone-400',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
