'use client'

import { useRouter } from 'next/navigation'
import { OrderDetail } from './OrderDetail'
import type { Order, Episode } from '@/types'

interface OrderDetailClientProps {
  order: Order
  episodes: Episode[]
}

export function OrderDetailClient({ order, episodes }: OrderDetailClientProps) {
  const router = useRouter()

  return (
    <OrderDetail
      order={order}
      episodes={episodes}
      onEpisodeClick={(episodeId) =>
        router.push(`/orders/${order.id}/episodes/${episodeId}`)
      }
      onStatusChange={async (_orderId, status) => {
        await fetch(`/api/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        router.refresh()
      }}
      onAddEpisode={async () => {
        const count = prompt('¿Cuántos episodios deseas agregar?', '1')
        if (!count) return
        const num = parseInt(count, 10)
        if (isNaN(num) || num < 1) return
        await fetch(`/api/orders/${order.id}/episodes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: num }),
        })
        router.refresh()
      }}
      onDelete={async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) return
        await fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
        router.push('/orders')
      }}
      onEditVendorAssignments={() => {
        alert('Funcionalidad disponible en Milestone 03')
      }}
    />
  )
}
