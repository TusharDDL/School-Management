'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  PieChart,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react'
import Link from 'next/link'

const financeModules = [
  {
    title: 'Fee Management',
    description: 'Manage student fees and payments',
    icon: DollarSign,
    href: '/finance/fees',
    color: 'bg-blue-500',
  },
  {
    title: 'Accounting',
    description: 'Track income and expenses',
    icon: FileText,
    href: '/finance/accounting',
    color: 'bg-green-500',
  },
  {
    title: 'Payroll',
    description: 'Staff salary and payroll',
    icon: CreditCard,
    href: '/finance/payroll',
    color: 'bg-purple-500',
  },
  {
    title: 'Invoicing',
    description: 'Generate and manage invoices',
    icon: Receipt,
    href: '/finance/invoicing',
    color: 'bg-yellow-500',
  },
  {
    title: 'Reports',
    description: 'Financial reports and analytics',
    icon: PieChart,
    href: '/finance/reports',
    color: 'bg-pink-500',
  },
  {
    title: 'Budget',
    description: 'Budget planning and tracking',
    icon: TrendingUp,
    href: '/finance/budget',
    color: 'bg-indigo-500',
  },
  {
    title: 'Assets',
    description: 'Asset management and tracking',
    icon: Building2,
    href: '/finance/assets',
    color: 'bg-red-500',
  },
  {
    title: 'Vendors',
    description: 'Manage vendors and suppliers',
    icon: Users,
    href: '/finance/vendors',
    color: 'bg-orange-500',
  },
]

export default function FinancePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <p className="text-gray-500">
          Manage school finances, fees, and accounting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {financeModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start space-x-4">
                <div
                  className={`${module.color} p-3 rounded-lg text-white`}
                >
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-500">
                    {module.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h4 className="text-2xl font-bold">$125,000</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <h4 className="text-2xl font-bold">$85,000</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Receipt className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Fees</p>
              <h4 className="text-2xl font-bold">$15,000</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <h4 className="text-2xl font-bold">$40,000</h4>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {[
              {
                type: 'fee',
                student: 'John Smith',
                amount: 1200,
                date: '2024-01-15',
                status: 'paid',
              },
              {
                type: 'salary',
                staff: 'Sarah Johnson',
                amount: 3500,
                date: '2024-01-14',
                status: 'processed',
              },
              {
                type: 'expense',
                description: 'Office Supplies',
                amount: 450,
                date: '2024-01-13',
                status: 'completed',
              },
              {
                type: 'fee',
                student: 'Mike Wilson',
                amount: 1200,
                date: '2024-01-12',
                status: 'pending',
              },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-3">
                  {transaction.type === 'fee' && (
                    <div className="bg-green-100 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {transaction.type === 'salary' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {transaction.type === 'expense' && (
                    <div className="bg-red-100 p-2 rounded-full">
                      <Receipt className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'fee'
                        ? `Fee Payment - ${transaction.student}`
                        : transaction.type === 'salary'
                        ? `Salary - ${transaction.staff}`
                        : transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'paid' ||
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : transaction.status === 'processed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
