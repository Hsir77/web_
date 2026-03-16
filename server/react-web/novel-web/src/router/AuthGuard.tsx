import { Navigate, useLocation } from "react-router-dom"
import  useUserStore  from "../store/user"

interface Props {
  children: React.ReactElement
  permission?: string | string[]
}

export default function PermissionGuard({ children, permission }: Props) {
  const permissions = useUserStore((s) => s.permissions)
  const location = useLocation()

  // 如果页面不需要权限，直接放行
  if (!permission) return children

  // 支持单权限或多权限
  const hasPermission = () => {
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p))
    }
    return permissions.includes(permission)
  }

  if (!hasPermission()) {
    return <Navigate to="/403" state={{ from: location }} replace />
  }

  return children
}