import { auth } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">
                Anda berhasil login, {session?.user?.name}!
            </h1>
        </div>
    );
}
