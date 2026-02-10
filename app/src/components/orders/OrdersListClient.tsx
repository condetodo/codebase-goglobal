'use client'

import { useRouter } from 'next/navigation'
import { OrdersList } from './OrdersList'
import type { Order } from '@/types'

interface OrdersListClientProps {
  orders: Order[]
}

export function OrdersListClient({ orders }: OrdersListClientProps) {
  const router = useRouter()

  return (
    <OrdersList
      orders={orders}
      onView={(id) => router.push(`/orders/${id}`)}
      onCreate={() => router.push('/assignment')}
      onDelete={async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) return
        await fetch(`/api/orders/${id}`, { method: 'DELETE' })
        router.refresh()
      }}
    />
  )
}
