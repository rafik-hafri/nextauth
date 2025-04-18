import UserInfo from "@/components/auth/user-info"
import { getCurrentUser } from "@/lib/auth"

async function ServerPage() {
    const user = await getCurrentUser()
  return (
    <UserInfo user={user} label="💻 Server component"/>
  )
}

export default ServerPage