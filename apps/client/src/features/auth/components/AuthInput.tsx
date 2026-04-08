import React from 'react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
  rightElement?: React.ReactNode
}

export function AuthInput({ icon, rightElement, className = '', ...props }: AuthInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        {...props}
        className={[
          'appearance-none rounded-md block w-full px-3 py-2 pl-10',
          rightElement ? 'pr-10' : '',
          'border border-gray-300 placeholder-gray-500 text-gray-900',
          'focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
          className,
        ].join(' ')}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  )
}