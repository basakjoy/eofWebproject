// import React from 'react';
// import { Loader } from 'lucide-react';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
//   size?: 'sm' | 'md' | 'lg';
//   loading?: boolean;
//   children: React.ReactNode;
// }

// export default function Button({
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   children,
//   disabled,
//   ...props
// }: ButtonProps) {
//   const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 tracking-tight transform hover:scale-105 active:scale-95';

//   const variants = {
//     primary: 'bg-[#0D73ED] dark:bg-[#4A9FF5] hover:bg-[#0A5CB8] hover:shadow-lg dark:hover:bg-[#6AC3FF] text-white dark:text-gray-900 shadow-md disabled:opacity-50 disabled:scale-100',
//     secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:scale-100',
//     danger: 'bg-red-600 dark:bg-red-700 hover:bg-red-700 hover:shadow-lg dark:hover:bg-red-600 text-white shadow-md disabled:opacity-50 disabled:scale-100',
//     outline: 'border-2 border-gray-300 dark:border-gray-600 hover:border-[#0D73ED] dark:hover:border-[#4A9FF5] hover:shadow-md text-gray-900 dark:text-white hover:text-[#0D73ED] dark:hover:text-[#4A9FF5] disabled:opacity-50 disabled:scale-100',
//     gradient: 'bg-gradient-to-r from-[#0D73ED] to-[#4A9FF5] dark:from-[#0D73ED] dark:to-[#6AC3FF] hover:shadow-lg text-white shadow-md disabled:opacity-50 disabled:scale-100',
//   };

//   const sizes = {
//     sm: 'px-4 py-2 text-sm',
//     md: 'px-6 py-2.5 text-base',
//     lg: 'px-8 py-3.5 text-lg',
//   };

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && <Loader className="w-4 h-4 animate-spin" />}
//       {children}
//     </button>
//   );
// }
'use client';

import React from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 
    tracking-tight relative overflow-hidden group disabled:cursor-not-allowed
    before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity 
    before:duration-300 hover:before:opacity-20 active:before:opacity-40
  `;

  const variants = {
    primary: `
      bg-gradient-to-br from-[#0D73ED] to-[#0A5CB8] dark:from-[#4A9FF5] dark:to-[#0D73ED]
      hover:shadow-2xl dark:hover:shadow-blue-500/50 text-white shadow-lg
      disabled:opacity-50 disabled:shadow-none
      relative before:absolute before:w-0 before:h-0 before:-top-0 before:-right-0 
      before:rounded-full before:bg-white before:opacity-30
      hover:before:w-96 hover:before:h-96 before:transition-all before:duration-500
    `,
    secondary: `
      bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800
      hover:shadow-xl dark:hover:shadow-gray-900/50 text-gray-900 dark:text-white shadow-md
      disabled:opacity-50 disabled:shadow-none
      border border-gray-200 dark:border-gray-600
      relative before:absolute before:w-0 before:h-0 before:-top-0 before:-right-0 
      before:rounded-full before:bg-gray-300 dark:before:bg-gray-500 before:opacity-20
      hover:before:w-96 hover:before:h-96 before:transition-all before:duration-500
    `,
    danger: `
      bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800
      hover:shadow-2xl dark:hover:shadow-red-500/50 text-white shadow-lg
      disabled:opacity-50 disabled:shadow-none
      relative before:absolute before:w-0 before:h-0 before:-top-0 before:-right-0 
      before:rounded-full before:bg-white before:opacity-30
      hover:before:w-96 hover:before:h-96 before:transition-all before:duration-500
    `,
    outline: `
      border-2 border-[#0D73ED] dark:border-[#4A9FF5] text-[#0D73ED] dark:text-[#4A9FF5]
      hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30
      relative bg-transparent hover:bg-[#0D73ED] hover:bg-opacity-5 dark:hover:bg-[#4A9FF5] dark:hover:bg-opacity-10
      transition-all duration-300 disabled:opacity-50 disabled:shadow-none
      before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-transparent 
      before:bg-gradient-to-r before:from-[#0D73ED] before:to-[#4A9FF5] before:opacity-0
      hover:before:opacity-20 before:transition-opacity before:duration-300
    `,
    gradient: `
      bg-gradient-to-r from-[#0D73ED] via-[#2E8CE8] to-[#4A9FF5] 
      dark:from-[#0D73ED] dark:via-[#2E8CE8] dark:to-[#6AC3FF]
      hover:shadow-2xl dark:hover:shadow-blue-500/60 text-white shadow-lg
      disabled:opacity-50 disabled:shadow-none
      relative before:absolute before:w-0 before:h-0 before:-top-0 before:-right-0 
      before:rounded-full before:bg-white before:opacity-30
      hover:before:w-96 hover:before:h-96 before:transition-all before:duration-500
      after:absolute after:inset-0 after:rounded-xl after:opacity-0
      after:bg-gradient-to-l after:from-[#4A9FF5] after:via-[#2E8CE8] after:to-[#0D73ED]
      hover:after:opacity-20 after:transition-opacity after:duration-300
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}