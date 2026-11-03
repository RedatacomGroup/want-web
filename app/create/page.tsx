import { AuthGuard } from "@/components/layout/AuthGuard";
import { DesireForm } from "@/components/create/DesireForm";
export default function CreateDesirePage(){return <AuthGuard><main className="create-shell"><DesireForm/></main></AuthGuard>}
