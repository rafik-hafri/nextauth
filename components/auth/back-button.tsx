import Link from 'next/link'
import { Button } from '../ui/button'


interface BckButtonProps {
    href:string
    label:string
}
function BackButton({href, label}:BckButtonProps) {
  return (
<Button variant="link" className='font-normal w-full text-center' size="sm" asChild>
    <Link href={href}>{label}</Link>
</Button>
)
}

export default BackButton