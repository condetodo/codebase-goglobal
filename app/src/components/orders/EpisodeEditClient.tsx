'use client'

import { useRouter } from 'next/navigation'
import { EpisodeEdit } from './EpisodeEdit'
import type { Episode, Order } from '@/types'

interface EpisodeEditClientProps {
  episode: Episode
  order: Order
}

export function EpisodeEditClient({ episode, order }: EpisodeEditClientProps) {
  const router = useRouter()

  return (
    <EpisodeEdit
      episode={episode}
      order={order}
      onSave={async (updatedEpisode) => {
        await fetch(`/api/orders/${order.id}/episodes/${episode.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: updatedEpisode.duration,
            status: updatedEpisode.status,
          }),
        })
        router.push(`/orders/${order.id}`)
      }}
      onCancel={() => router.push(`/orders/${order.id}`)}
      onAddVendor={async (_episodeId, vendor) => {
        await fetch(
          `/api/orders/${order.id}/episodes/${episode.id}/assignments`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vendorId: vendor.vendorId,
              phase: vendor.phase,
              minutesWorked: vendor.minutesWorked,
              deadline: vendor.deadline,
            }),
          }
        )
        router.refresh()
      }}
      onRemoveVendor={async (_episodeId, vendorId, phase) => {
        await fetch(
          `/api/orders/${order.id}/episodes/${episode.id}/assignments`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendorId, phase }),
          }
        )
        router.refresh()
      }}
      onUpdateMinutes={async (_episodeId, vendorId, phase, minutes) => {
        await fetch(
          `/api/orders/${order.id}/episodes/${episode.id}/assignments`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendorId, phase, minutesWorked: minutes }),
          }
        )
        router.refresh()
      }}
    />
  )
}
