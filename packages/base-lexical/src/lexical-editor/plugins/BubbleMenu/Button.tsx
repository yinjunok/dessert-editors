import React, { FC } from 'react'
import clsx from 'clsx'

export type ButtonProps = {
  isActive?: boolean,
  icon?: React.ReactNode
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button: FC<ButtonProps> = ({ icon, children, className, isActive = false, ...props }) => {
  return (
    <button
      className={clsx('bubble-menu-btn', {['active']: isActive}, className)}
      {...props}
    >
      {icon}
      {
        children && (
          <span>{children}</span>
        )
      }
    </button>
  )
}

export default Button
