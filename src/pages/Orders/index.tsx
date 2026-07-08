import { useLocation } from 'react-router-dom'
import { PageShell } from '../../components/common/PageShell'
import OrdersTable from '../../components/orders/OrdersTable'

const statusMap: Record<string, { title: string; description: string; status: "new" | "ready" | "pickup" | "completed" }> = {
  '/orders': { title: 'Pesanan', description: 'Kelola pesanan pelanggan dari satu tempat.', status: 'new' },
  '/orders/new': { title: 'Pesanan Baru', description: 'Daftar pesanan yang baru masuk dari marketplace.', status: 'new' },
  '/orders/ready': { title: 'Siap Dicetak', description: 'Pesanan yang siap untuk pencetakan label.', status: 'ready' },
  '/orders/pickup': { title: 'Menunggu Pickup', description: 'Pesanan yang menunggu proses pickup.', status: 'pickup' },
  '/orders/completed': { title: 'Selesai', description: 'Pesanan yang telah selesai diproses.', status: 'completed' },
}

export function OrdersPage() {
  const location = useLocation()
  const current = statusMap[location.pathname] ?? statusMap['/orders']

  return (
    <div className="space-y-6">
      <PageShell title={current.title} description={current.description}>
        <OrdersTable status={current.status} />
      </PageShell>
    </div>
  )
}
