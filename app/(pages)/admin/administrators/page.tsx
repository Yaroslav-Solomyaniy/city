// app/(pages)/admin/administrators/page.tsx
import { getAdministrators } from '@/app/actions/admin/administrators/get-admins'
import {AdministratorsClient} from "@/app/(pages)/admin/administrators/client-page";

export default async function AdministratorsPage() {
    const { admins, invites } = await getAdministrators()
    return <AdministratorsClient admins={admins} invites={invites} />
}